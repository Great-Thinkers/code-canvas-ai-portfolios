
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, contentType, tone, currentContent, customPrompt } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch user's GitHub and LinkedIn data
    const { data: githubProfile } = await supabaseClient
      .from('github_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: linkedinProfile } = await supabaseClient
      .from('linkedin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: githubRepos } = await supabaseClient
      .from('github_repositories')
      .select('*')
      .eq('github_profile_id', githubProfile?.id)
      .order('stargazers_count', { ascending: false })
      .limit(10);

    const { data: linkedinExperiences } = await supabaseClient
      .from('linkedin_experiences')
      .select('*')
      .eq('linkedin_profile_id', linkedinProfile?.id)
      .order('start_date', { ascending: false });

    const { data: linkedinEducation } = await supabaseClient
      .from('linkedin_education')
      .select('*')
      .eq('linkedin_profile_id', linkedinProfile?.id)
      .order('start_date', { ascending: false });

    // Build context for AI
    const userContext = {
      github: {
        username: githubProfile?.username,
        bio: githubProfile?.bio,
        company: githubProfile?.company,
        location: githubProfile?.location,
        publicRepos: githubProfile?.public_repos,
        followers: githubProfile?.followers,
        repositories: githubRepos?.map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          topics: repo.topics,
        })),
      },
      linkedin: {
        firstName: linkedinProfile?.first_name,
        lastName: linkedinProfile?.last_name,
        headline: linkedinProfile?.headline,
        summary: linkedinProfile?.summary,
        location: linkedinProfile?.location,
        industry: linkedinProfile?.industry,
        experiences: linkedinExperiences?.map(exp => ({
          title: exp.title,
          company: exp.company_name,
          description: exp.description,
          startDate: exp.start_date,
          endDate: exp.end_date,
          isCurrent: exp.is_current,
        })),
        education: linkedinEducation?.map(edu => ({
          institution: edu.institution_name,
          degree: edu.degree,
          fieldOfStudy: edu.field_of_study,
          description: edu.description,
        })),
      },
    };

    // Generate content based on type and context
    const prompt = buildPrompt(contentType, tone, userContext, currentContent, customPrompt);
    
    // Call OpenAI API (you would need to set up OpenAI API key in secrets)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio content writer. Generate engaging, professional content based on the user\'s data and requirements.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('Failed to generate content with AI');
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = openaiData.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

function buildPrompt(contentType: string, tone: string, userContext: any, currentContent?: string, customPrompt?: string): string {
  const baseContext = `
User Data:
- Name: ${userContext.linkedin.firstName} ${userContext.linkedin.lastName}
- GitHub: ${userContext.github.username}
- LinkedIn Headline: ${userContext.linkedin.headline}
- Location: ${userContext.linkedin.location || userContext.github.location}
- Industry: ${userContext.linkedin.industry}

GitHub Profile:
- Bio: ${userContext.github.bio}
- Public Repos: ${userContext.github.publicRepos}
- Top Projects: ${userContext.github.repositories?.slice(0, 5).map(repo => `${repo.name} (${repo.language}, ${repo.stars} stars)`).join(', ')}

Recent Experience: ${userContext.linkedin.experiences?.slice(0, 3).map(exp => `${exp.title} at ${exp.company}`).join(', ')}

Education: ${userContext.linkedin.education?.map(edu => `${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}`).join(', ')}
`;

  let specificPrompt = '';
  
  switch (contentType) {
    case 'bio':
      specificPrompt = `Generate a professional bio (2-3 paragraphs) that highlights the person's expertise, background, and unique value proposition.`;
      break;
    case 'project_description':
      specificPrompt = `Generate compelling descriptions for their top GitHub projects that highlight technical skills and impact.`;
      break;
    case 'skill_summary':
      specificPrompt = `Create a skills summary that showcases their technical expertise based on their GitHub repositories and LinkedIn experience.`;
      break;
    case 'experience_summary':
      specificPrompt = `Write a professional experience summary that highlights their career progression and achievements.`;
      break;
  }

  let toneInstruction = '';
  switch (tone) {
    case 'professional':
      toneInstruction = 'Use a formal, business-appropriate tone.';
      break;
    case 'casual':
      toneInstruction = 'Use a friendly, approachable tone.';
      break;
    case 'creative':
      toneInstruction = 'Use an innovative, artistic tone.';
      break;
    case 'technical':
      toneInstruction = 'Use a detail-oriented, precise tone.';
      break;
  }

  return `${baseContext}

${specificPrompt}

Tone: ${toneInstruction}

${currentContent ? `Current content to improve/replace: ${currentContent}` : ''}

${customPrompt ? `Additional requirements: ${customPrompt}` : ''}

Generate high-quality, engaging content that would be perfect for a developer portfolio. Make it specific to this person's background and experience.`;
}
