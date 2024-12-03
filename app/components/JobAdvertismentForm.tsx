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
import { useEffect, useState } from 'react';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import { useScrollToTop } from '@/lib/useScrollToTop';

export default function JobAdvertisementForm() {
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const supabase = createClient();
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

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
        .eq('resume_id', resumeId)
        .limit(1)
        .single();

      setJobAdvertisement(data);
    }

    fetchJobAdvertisement();
  }, [userEmail, resumeId, supabase]);

  async function submitJobAdvertisement(formData: FormData) {
    const jobAdvertisement = {
      text: formData.get('job-advertisement') as string,
      user_id: userEmail,
      created_at: new Date().toISOString(),
      resume_id: resumeId,
    };

    try {
      await supabase
        .from('job_advertisement')
        .upsert(jobAdvertisement, { onConflict: 'resume_id' })
        .select();

      stepper.next();
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
          <Textarea
            name="job-advertisement"
            required
            defaultValue={jobAdvertisement?.text ?? ''}
            className="min-h-[250px]"
          />
          {/* TODO: adding a link to a job advertisement should extract the text with a web crawler */}
        </CardContent>
      </Card>

      <div className="flex justify-end py-2">
        <SubmitButton text="Next" />
      </div>
    </form>
  );
}
