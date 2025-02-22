import PersonalInformationForm from '@/app/components/PersonalInformationForm';
import { auth } from '@/auth';
import { fetchPersonalInfo } from '@/lib/supabase/queries';
import supabaseClient from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function Page({
  params: { resumeId },
}: {
  params: { resumeId: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (userId == null) {
    return notFound();
  }

  const supabase = supabaseClient(cookies);
  const response = await fetchPersonalInfo({
    supabaseClient: supabase,
    userId,
    resumeId,
  });

  const { error, data: initialData } = response;
  if (error) {
    console.error(error);
    return notFound();
  }

  return <PersonalInformationForm initialData={initialData} />;
}
