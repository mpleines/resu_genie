import {
  Education,
  JobAdvertisement,
  PersonalInformation,
  Skill,
  Summary,
  WorkExperience,
} from '@/types/types';
import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

type CommonResumeQueryParams = {
  supabaseClient: SupabaseClient;
  userId: string;
  resumeId: string;
};

export async function fetchJobAdvertisementByResumeId({
  supabaseClient,
  userId,
  resumeId,
}: CommonResumeQueryParams): Promise<
  PostgrestSingleResponse<JobAdvertisement | null>
> {
  return await supabaseClient
    .from('job_advertisement')
    .select()
    .eq('user_id', userId)
    .eq('resume_id', resumeId)
    .limit(1)
    .maybeSingle();
}

export async function fetchPersonalInfo({
  supabaseClient,
  userId,
  resumeId,
}: CommonResumeQueryParams): Promise<
  PostgrestSingleResponse<PersonalInformation | null>
> {
  return await supabaseClient
    .from('personal_information')
    .select()
    .eq('user_id', userId)
    .eq('resume_id', resumeId)
    .limit(1)
    .maybeSingle();
}

export async function fetchSkills({
  supabaseClient,
  userId,
  resumeId,
}: CommonResumeQueryParams): Promise<PostgrestSingleResponse<Skill[]>> {
  return await supabaseClient
    .from('skills')
    .select()
    .eq('user_id', userId)
    .eq('resume_id', resumeId);
}

export async function fetchWorkExperiences({
  supabaseClient,
  userId,
  resumeId,
}: CommonResumeQueryParams): Promise<
  PostgrestSingleResponse<WorkExperience[]>
> {
  return await supabaseClient
    .from('work_experience')
    .select()
    .eq('user_id', userId)
    .eq('resume_id', resumeId);
}

export async function fetchEducation({
  supabaseClient,
  userId,
  resumeId,
}: CommonResumeQueryParams): Promise<PostgrestSingleResponse<Education[]>> {
  return await supabaseClient
    .from('education')
    .select()
    .eq('user_id', userId)
    .eq('resume_id', resumeId);
}

export async function fetchSummary({
  supabaseClient,
  userId,
  resumeId,
}: CommonResumeQueryParams): Promise<PostgrestSingleResponse<Summary>> {
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
