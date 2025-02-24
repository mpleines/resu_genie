import PersonalInformationForm from '@/app/components/PersonalInformationForm';
import { auth } from '@/auth';
import { fetchPersonalInfo } from '@/lib/supabase/queries';
import supabaseClient from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const resumeId = (await params).resumeId;
  const session = await auth();
  const userId = session?.user?.id;
  if (userId == null) {
    return notFound();
  }

  const supabase = supabaseClient();
  const response = await fetchPersonalInfo({
    supabaseClient: supabase,
    userId,
    resumeId,
  });

  const { error, data: initialData } = response;
  if (error) {
    return notFound();
  }

  return <PersonalInformationForm initialData={initialData} />;
}
