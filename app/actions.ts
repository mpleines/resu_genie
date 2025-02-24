'use server';

import openAiClient from '@/lib/openaiClient';
import { createResumePrompt, ResumeResponse } from '@/lib/promptHelper';
import supabaseClient from '@/lib/supabase/server';
import { Summary } from '@/types/types';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export async function generateResume(
  resumeId: string,
  data: Summary,
  user: Session['user']
) {
  const supabase = supabaseClient();
  // FIXME: type errors
  const resumePromptData = {
    // Job advertisement
    job_advertisement: data?.job_advertisement.text ?? '',
    // Personal information
    personal_information: {
      ...data?.personal_information!,
      // User's email is required
      email: user?.email!,
    },
    // Skills
    skills: data?.skills?.map((skill) => skill.skill_name) ?? [],
    // Work experience
    work_experience: data?.work_experience!,
    // Education
    education: data?.education ?? [],
  };

  const prompt = createResumePrompt(resumePromptData);
  const response = await openAiClient.completions(prompt);
  const resumeResponseStr = response.data.choices[0].message.content;
  const resumeData: ResumeResponse = JSON.parse(resumeResponseStr);

  // save resume data to supabase
  try {
    await supabase
      .from('resume')
      .update({
        chat_gpt_response_raw: resumeData,
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', user?.id!);
  } catch (error) {
    console.error(error);
  } finally {
    redirect(`/resume/${resumeId}/download-resume`);
  }
}
