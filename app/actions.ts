'use server';

import supabaseClient from '@/lib/supabase/server';
import { Session } from 'next-auth';

export async function generateResumeJob(
  resumeId: string,
  user: Session['user']
) {
  const supabase = supabaseClient();

  if (user?.email == null || user?.id == null) {
    throw new Error('user email or id is null');
  }

  try {
    // Check if there's already a job for this resume
    const { data: existingJob } = await supabase
      .from('resume_job')
      .select()
      .eq('resume_id', Number(resumeId))
      .single();

    // if the job is still pending or already done, return
    if (existingJob?.status === 'pending' || existingJob?.status === 'done') {
      return { jobId: existingJob.id };
    }

    const { data: job, error } = await supabase
      .from('resume_job')
      .insert({
        created_at: new Date().toISOString(),
        status: 'pending',
        resume_id: Number(resumeId),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return { jobId: null };
    }

    const { error: edgeFnError } = await supabase.functions.invoke(
      'generate_resume',
      {
        body: {
          name: 'Functions',
          resumeJobId: job.id,
          resumeId,
          userId: user.id,
          userEmail: user.email,
        },
      }
    );

    if (edgeFnError) {
      console.error('Error invoking generate_resume function:', edgeFnError);
      await supabase
        .from('resume_job')
        .update({ status: 'failed' })
        .eq('id', job.id);
      throw new Error('Failed to invoke generate_resume function');
    }

    return { jobId: job.id };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
}
