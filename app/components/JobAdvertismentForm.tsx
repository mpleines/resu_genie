'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SubmitButton from './SubmitButton';

// TODO: rewrite this as a server component

export default function JobAdvertisementForm() {
  const router = useRouter();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const supabase = createClient();

  const [jobAdvertisement, setJobAdvertisement] = useState<
    Database['public']['Tables']['job_advertisement']['Row'] | null
  >();

  useEffect(() => {
    async function fetchJobAdvertisement() {
      if (userEmail == null) {
        return;
      }

      const { data } = await supabase
        .from('job_advertisement')
        .select()
        .eq('user_id', userEmail)
        .limit(1)
        .single();

      setJobAdvertisement(data);
    }

    fetchJobAdvertisement();
  }, [userEmail]);

  async function submitJobAdvertisement(formData: FormData) {
    const jobAdvertisement = {
      text: formData.get('job-advertisement') as string,
      user_id: userEmail,
      created_at: new Date().toISOString(),
      resume_id: 1, // FIXME: get correct resume id
    };

    try {
      await supabase
        .from('job_advertisement')
        .upsert(jobAdvertisement, { onConflict: 'resume_id' })
        .select();

      router.push('/personal-information');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form action={submitJobAdvertisement}>
      <Card>
        <CardHeader>
          <CardTitle>Job Advertisement</CardTitle>
          <CardDescription>
            Copy the Job Advertisement Text in here to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form onSubmit={handleSubmit}> */}
          <Textarea
            name="job-advertisement"
            required
            defaultValue={jobAdvertisement?.text ?? ''}
          />
          {/* TODO: adding a link to a job advertisement should extract the text with a web crawler */}
          {/* </form> */}
        </CardContent>
      </Card>

      <div className="flex justify-end py-2">
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
