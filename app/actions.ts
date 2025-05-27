'use server';

import { createResumePrompt, ResumeResponseSchema } from '@/lib/promptHelper';
import supabaseClient from '@/lib/supabase/server';
import { Summary } from '@/types/types';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { generateObject } from 'ai';
import openAiClient from '@/lib/openaiClient';

export async function generateResume(
  resumeId: string,
  data: Summary,
  user: Session['user']
) {
  const supabase = supabaseClient();
  // FIXME: type errors

  if (user?.email == null) {
    throw new Error('user email is null');
  }

  if (user?.id == null) {
    throw new Error('user id is null');
  }

  const resumePromptData = {
    // Job advertisement
    job_advertisement: data?.job_advertisement.text ?? '',
    // Personal information
    personal_information: {
      ...data.personal_information,
      // User's email is required
      email: user.email,
    },
    // Skills
    skills: data?.skills?.map((skill) => skill.skill_name),
    // Work experience
    work_experience: data.work_experience,
    // Education
    education: data.education,
  };

  const prompt = createResumePrompt(resumePromptData);
  const response = await generateObject({
    model: openAiClient.chat('gpt-4o-mini'),
    schema: ResumeResponseSchema,
    messages: [{ role: 'user', content: prompt }],
  });

  const resumeData = response.object;

  // save resume data to supabase
  try {
    await supabase
      .from('resume')
      .update({
        chat_gpt_response_raw: resumeData,
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', user.id);
  } catch (error) {
    console.error(error);
  } finally {
    redirect(`/resume/${resumeId}/download-resume`);
  }
}
