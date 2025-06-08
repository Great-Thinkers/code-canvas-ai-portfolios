
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateContentRequest {
  type: 'bio' | 'project' | 'skill' | 'experience' | 'summary';
  context: any;
  tone?: 'professional' | 'casual' | 'creative';
  length?: 'short' | 'medium' | 'long';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid user token')
    }

    // Fetch user's subscription and usage
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select(`
        status,
        plan:subscription_plans (
          name,
          features,
          max_ai_generations 
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching subscription:', subscriptionError)
      throw new Error('Error fetching subscription details.')
    }

    const { data: usageData, error: usageError } = await supabase
      .from('user_usage')
      .select('ai_generations_count')
      .eq('user_id', user.id)
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Error fetching usage data:', usageError)
      throw new Error('Error fetching usage data.')
    }
    
    const planFeatures = subscriptionData?.plan?.features as Record<string, boolean> | undefined;
    const canUseAI = planFeatures?.ai_content === true;
    const currentGenerationCount = usageData?.ai_generations_count || 0;
    // Max generations: -1 for unlimited, otherwise use the value from plan or default to a low number for safety.
    // Assuming 'max_ai_generations' field on subscription_plans table.
    // If subscriptionData or plan is null, user might be on a default/free tier not explicitly in user_subscriptions.
    // For this example, let's assume if no explicit plan, they get a very limited allowance (e.g. 5)
    // or denied if no subscriptionData is found.
    
    let maxGenerations = 0; // Default to 0, meaning no generations allowed.
    
    if (subscriptionData && subscriptionData.plan) {
      if (subscriptionData.plan.max_ai_generations === -1) { // Unlimited
        maxGenerations = Infinity;
      } else if (subscriptionData.plan.max_ai_generations != null) {
        maxGenerations = subscriptionData.plan.max_ai_generations;
      }
    } else {
      // Fallback for users without an explicit subscription entry but potentially with default access.
      // For instance, a truly free tier might not have a user_subscriptions row.
      // Let's assume a default of 5 for users not found in user_subscriptions or with no plan attached.
      // This part needs to align with how free/default users are handled.
      // For now, if no subscriptionData, we'll deny access.
      // A more robust solution might involve a default plan in the DB.
       if (!subscriptionData) {
         console.warn(`User ${user.id} has no subscription entry. Denying AI content generation.`);
         return new Response(
           JSON.stringify({ error: 'Access denied. No active subscription with AI capabilities.', success: false }),
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
         );
       }
       // If there is subscriptionData but no specific plan.max_ai_generations, could default here too.
       // For now, handled by maxGenerations defaulting to 0 if not set.
    }


    if (!canUseAI) {
      console.log(`User ${user.id} denied AI content generation due to plan restrictions (feature flag).`)
      return new Response(
        JSON.stringify({ error: 'Your current plan does not include AI content generation.', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    if (currentGenerationCount >= maxGenerations) {
      console.log(`User ${user.id} denied AI content generation due to usage limits (count: ${currentGenerationCount}, max: ${maxGenerations}).`)
      return new Response(
        JSON.stringify({ error: 'You have reached your AI generation limit for this period.', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    const { type, context, tone = 'professional', length = 'medium' }: GenerateContentRequest = await req.json()

    // Use your Groq API key - Consider moving to environment variables for better security
    const groqApiKey = Deno.env.get('GROQ_API_KEY') // Ensure this is set in your Supabase project
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not configured in environment variables.')
      throw new Error('AI service API key not configured')
    }

    console.log(`Generating ${type} content for user ${user.id} (Usage: ${currentGenerationCount}/${maxGenerations}) using Groq`)

    // Generate prompt based on content type
    let prompt = ''
    let maxTokens = 150

    switch (type) {
      case 'bio':
        prompt = `Write a ${tone} professional bio for a developer. Include their skills, experience, and personality. Context: ${JSON.stringify(context)}`
        maxTokens = length === 'short' ? 100 : length === 'medium' ? 200 : 300
        break
      
      case 'project':
        prompt = `Write a compelling project description for a developer's portfolio. Make it ${tone} and highlight the technical aspects, challenges solved, and impact. Project: ${JSON.stringify(context)}`
        maxTokens = length === 'short' ? 150 : length === 'medium' ? 250 : 400
        break
      
      case 'skill':
        prompt = `Write a brief description of why this skill is valuable and how it's used in development. Be ${tone}. Skill: ${context.skill || context}`
        maxTokens = 100
        break
      
      case 'experience':
        prompt = `Write a professional summary of this work experience, highlighting achievements and technologies used. Tone: ${tone}. Experience: ${JSON.stringify(context)}`
        maxTokens = length === 'short' ? 150 : length === 'medium' ? 250 : 400
        break
      
      case 'summary':
        prompt = `Write a compelling professional summary for a developer's portfolio. Make it ${tone} and highlight their unique value proposition. Developer info: ${JSON.stringify(context)}`
        maxTokens = length === 'short' ? 150 : length === 'medium' ? 250 : 400
        break
      
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }

    // Call Groq API with your model
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter specializing in developer portfolios. Write engaging, authentic content that helps developers showcase their skills and experience effectively. Keep responses concise and impactful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: tone === 'creative' ? 0.8 : tone === 'casual' ? 0.7 : 0.6,
      }),
    })

    if (!groqResponse.ok) {
      const error = await groqResponse.text()
      console.error('Groq API error:', error)
      throw new Error(`Groq API error: ${groqResponse.status}`)
    }

    const groqResult = await groqResponse.json()
    const generatedContent = groqResult.choices[0]?.message?.content?.trim()

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    // Increment AI generation count
    // Using supabase.rpc to call a Postgres function is safer for increments
    // Create a function like:
    // CREATE OR REPLACE FUNCTION increment_ai_generations(user_id_param uuid)
    // RETURNS void AS $$
    // BEGIN
    //   INSERT INTO user_usage (user_id, ai_generations_count)
    //   VALUES (user_id_param, 1)
    //   ON CONFLICT (user_id) DO UPDATE
    //   SET ai_generations_count = user_usage.ai_generations_count + 1;
    // END;
    // $$ LANGUAGE plpgsql;
    //
    // For now, using a direct update for simplicity, but RPC is preferred.
    const { error: updateUsageError } = await supabase
      .from('user_usage')
      .upsert({ user_id: user.id, ai_generations_count: currentGenerationCount + 1 }, { onConflict: 'user_id' })
      // .rpc('increment_ai_generations', { user_id_param: user.id }) // Preferred method

    if (updateUsageError) {
      console.error('Failed to update AI generation count:', updateUsageError)
      // Decide if this should be a critical error. For now, log and proceed.
    }
    
    console.log(`Successfully generated ${type} content using Groq for user ${user.id}. New count: ${currentGenerationCount + 1}`)

    return new Response(
      JSON.stringify({ 
        content: generatedContent,
        type,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating AI content for user ' + (req.headers.get('Authorization') ? ' (auth token present)' : '(no auth token)'), error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate content',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
