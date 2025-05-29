
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateContentRequest {
  type: 'bio' | 'project-description' | 'skill-summary';
  context: {
    name?: string;
    title?: string;
    skills?: string[];
    experience?: any[];
    repositories?: any[];
    role?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, context }: GenerateContentRequest = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context-aware prompts based on the content type
    let prompt = '';
    
    switch (type) {
      case 'bio':
        prompt = generateBioPrompt(context);
        break;
      case 'project-description':
        prompt = generateProjectDescriptionPrompt(context);
        break;
      case 'skill-summary':
        prompt = generateSkillSummaryPrompt(context);
        break;
      default:
        throw new Error('Invalid content type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio writer who creates engaging, authentic content for developers and professionals. Write in a natural, professional tone that showcases expertise without being overly promotional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    return new Response(
      JSON.stringify({ content: content.trim() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function generateBioPrompt(context: any): string {
  const { name, title, skills, experience, repositories, role } = context;
  
  let prompt = `Write a professional bio for ${name || 'a developer'} who is a ${title || 'software developer'}.`;
  
  if (role) {
    prompt += ` This bio is for a ${role.replace('-', ' ')} portfolio.`;
  }
  
  if (skills && skills.length > 0) {
    prompt += ` Their key skills include: ${skills.slice(0, 8).join(', ')}.`;
  }
  
  if (experience && experience.length > 0) {
    const recentExp = experience[0];
    prompt += ` They have experience as ${recentExp.title} at ${recentExp.companyName}.`;
  }
  
  if (repositories && repositories.length > 0) {
    const topRepos = repositories.slice(0, 3).map(repo => repo.name).join(', ');
    prompt += ` Some of their notable projects include: ${topRepos}.`;
  }
  
  prompt += ' Write a 2-3 sentence bio that is engaging, professional, and highlights their expertise. Focus on their impact and what makes them unique.';
  
  return prompt;
}

function generateProjectDescriptionPrompt(context: any): string {
  const { repositories, skills } = context;
  
  let prompt = 'Write a brief project description for a software project.';
  
  if (repositories && repositories.length > 0) {
    const repo = repositories[0];
    prompt += ` The project is called "${repo.name}"`;
    if (repo.description) {
      prompt += ` and currently has this description: "${repo.description}"`;
    }
    if (repo.language) {
      prompt += ` and is built with ${repo.language}`;
    }
  }
  
  if (skills && skills.length > 0) {
    prompt += `. Technologies that might be relevant: ${skills.join(', ')}.`;
  }
  
  prompt += ' Write a compelling 1-2 sentence description that explains what the project does and its value.';
  
  return prompt;
}

function generateSkillSummaryPrompt(context: any): string {
  const { skills, role, experience } = context;
  
  let prompt = `Write a brief summary of technical skills for a ${role?.replace('-', ' ') || 'developer'}.`;
  
  if (skills && skills.length > 0) {
    prompt += ` Their skills include: ${skills.join(', ')}.`;
  }
  
  if (experience && experience.length > 0) {
    prompt += ` They have ${experience.length} role(s) of experience.`;
  }
  
  prompt += ' Write a 1-2 sentence summary that groups and highlights their key technical competencies.';
  
  return prompt;
}
