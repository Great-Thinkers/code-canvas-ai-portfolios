
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

    const { type, context, tone = 'professional', length = 'medium' }: GenerateContentRequest = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log(`Generating ${type} content for user ${user.id}`)

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

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter specializing in developer portfolios. Write engaging, authentic content that helps developers showcase their skills and experience effectively.'
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

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiResult = await openaiResponse.json()
    const generatedContent = openaiResult.choices[0]?.message?.content?.trim()

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    console.log(`Successfully generated ${type} content`)

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
    console.error('Error generating AI content:', error)
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
