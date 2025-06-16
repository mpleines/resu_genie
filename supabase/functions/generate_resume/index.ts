import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateObject } from 'https://esm.sh/ai';
import { createOpenAI } from 'https://esm.sh/@ai-sdk/openai';
import { z } from 'https://esm.sh/zod';
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// TODO: move this to a shared folder to avoid duplicating from /types/types.ts
type Summary = {
  job_advertisement: {
    text: string;
  };
  personal_information: {
    city: string;
    name: string;
    address: string;
    phone_1: string;
    professional_experience_in_years: number;
  };
  skills: {
    skill_name: string;
  }[];
  work_experience: {
    profile: string;
    end_date: string;
    start_date: string;
    job_description: string;
    organisation_name: string;
  }[];
  education: {
    degree: string;
    end_date: string;
    start_date: string;
    institute_name: string;
  }[];
};

export const ResumeResponseSchema = z.object({
  job_advertisement: z.string(),
  summary: z.string(),
  personal_information: z.object({
    name: z.string(),
    email: z.string(),
    phone_1: z.string(),
    address: z.string(),
    city: z.string(),
    professional_experience_in_years: z.number(),
  }),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      institute_name: z.string(),
      degree: z.string().optional(),
      start_date: z.string(),
      end_date: z.string(),
    })
  ),
  work_experience: z.array(
    z.object({
      organisation_name: z.string(),
      job_description: z.array(z.string()).optional(),
      start_date: z.string(),
      end_date: z.string(),
      profile: z.string(),
    })
  ),
  improvement_tips: z.array(z.string()),
});

const resumeResponseTemplate = {
  job_advertisement: 'Job description',
  summary: 'A concise professional summary tailored to the job description.',
  personal_information: {
    name: 'Full Name',
    phone_1: 'Phone Number',
    email: 'Email Address',
    address: 'Address',
    city: 'City',
    professional_experience_in_years: 0,
  },
  skills: ['List of relevant skills based on job description and resume data'],
  education: [
    {
      institute_name: 'Institution Name',
      degree: 'Degree',
      start_date: 'Start Date',
      end_date: 'End Date',
    },
  ],
  work_experience: [
    {
      profile: 'Job Title',
      job_description: ['List of responsibilities and achievements'],
      organisation_name: 'Company Name',
      start_date: 'Start Date',
      end_date: 'End Date',
    },
  ],
  improvement_tips: [
    'List any tips for improving the resume, including any missing information or areas that could be strengthened.',
  ],
};

const createResumePrompt = (resumePromptData: Summary) => `
  You will generate a resume based on the following job description and applicant resume data.

  Job Description:
  ${resumePromptData.job_advertisement}

  Resume Data:
  ${JSON.stringify({
    ...resumePromptData,
    job_advertisement: undefined,
  })}

  Instructions:
  1. Analyze the job description and resume data carefully.
  2. Use the data provided to fill in each section: Personal Information, Summary, Skills, Education, and Work Experience.
  3. If a relevant detail for a section is missing, infer reasonable content from the context without introducing new qualifications, skills, or education that the applicant has not mentioned.
  4. for work_experience.job_description, generate a list of responsibilities and achievements based on the job description and resume data that can be used with bullet points. 
  5. Ensure the resume is optimized for Application Tracking Systems (ATS), using keywords from the job description when appropriate.
  6. Do not exaggerate or invent qualifications. Stick closely to the applicant's resume data.
  7. Format the output as a valid JSON object. Do not return markdown, just the JSON object itself with the following structure:

  ${resumeResponseTemplate}

  8. Ensure all keys in the JSON template are filled, and only output the filled JSON structure.
  9. Provide tips for improvement in the "improvement_tips" section. If something critical is missing, such as a major skill or job detail, flag it in the tips.
  10. If calculating dates or durations, ensure the correct year is {datetime.datetime.now().year}.
`;
const openAiClient = createOpenAI({
  compatibility: 'strict',
  apiKey: Deno.env.get('NEXT_PUBLIC_OPENAI_API_KEY'),
});

async function fetchSummary({
  supabaseClient,
  userId,
  resumeId,
}: {
  supabaseClient: SupabaseClient;
  userId: string;
  resumeId: string;
}) {
  return await supabaseClient
    .from('resume')
    .select(
      `
        job_advertisement (text),
        personal_information (name, phone_1, address, city, professional_experience_in_years),
        skills (skill_name),
        work_experience (organisation_name, profile, job_description ,start_date, end_date),
        education (institute_name, degree, start_date, end_date)
      `
    )
    .eq('id', resumeId)
    .eq('user_id', userId)
    .single();
}

Deno.serve(async (req) => {
  const { resumeJobId, resumeId, userId, userEmail } = await req.json();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { data, error: summaryError } = await fetchSummary({
      supabaseClient: supabase,
      userId,
      resumeId: resumeId.toString(),
    });
    if (!data) {
      throw new Error(
        `Error fetching summary data: ${
          summaryError?.message ?? JSON.stringify(summaryError)
        }`
      );
    }
    const resumePromptData = {
      job_advertisement: data?.job_advertisement?.text ?? '',
      personal_information: {
        ...data.personal_information,
        email: userEmail,
      },
      skills: data?.skills?.map((skill) => skill.skill_name),
      work_experience: data.work_experience,
      education: data.education,
    };
    const prompt = createResumePrompt(resumePromptData);
    const response = await generateObject({
      model: openAiClient.chat('gpt-4o-mini'),
      schema: ResumeResponseSchema,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    const resumeData = response.object;
    await supabase
      .from('resume')
      .update({
        chat_gpt_response_raw: resumeData,
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', userId);
    await supabase
      .from('resume_job')
      .update({
        status: 'done',
      })
      .eq('id', resumeJobId);
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error('Function error:', error);
    await supabase
      .from('resume_job')
      .update({
        status: 'failed',
      })
      .eq('id', resumeJobId);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
