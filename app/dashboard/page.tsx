import supabaseClient from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import ResumePreview from '../components/ResumePreview';
import { NewResume } from '../components/NewResumeCard';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  const supabase = supabaseClient(cookies);
  const { data: resumes } = await supabase
    .from('resume')
    .select(
      `
      id, last_updated,
      job_advertisement (text),
      personal_information (name, phone_1, address, city, professional_experience_in_years),
      skills (skill_name),
      work_experience (organisation_name, profile, start_date, end_date),
      education (institute_name, start_date, end_date)
    `
    )
    .eq('user_id', userEmail!)
    .order('last_updated', { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">My Resumes</h1>
      <div className="flex flex-wrap gap-4">
        <NewResume />
        {resumes?.map((resume) => (
          <ResumePreview
            key={resume.id}
            resumeId={resume.id.toString()}
            name={resume.personal_information?.name}
            skills={resume.skills?.map((skill) => skill.skill_name) || []}
            last_updated={resume.last_updated}
          />
        ))}
      </div>
    </div>
  );
}
