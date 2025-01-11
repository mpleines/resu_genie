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
import { useSession } from 'next-auth/react';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  jobAdvertisement: z.string().min(1, { message: 'This field is required' }),
});

export default function JobAdvertisementForm() {
  useScrollToTop();

  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const supabase = createClient();
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const jobAdvertisement = await fetchJobAdvertisement();
      return { jobAdvertisement: jobAdvertisement ?? '' };
    },
  });

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

    return data?.text;
  }

  async function submitJobAdvertisement(jobAd: string) {
    const jobAdvertisement = {
      text: jobAd,
      user_id: userEmail,
      created_at: new Date().toISOString(),
      resume_id: resumeId,
    };

    try {
      // FIXME: supabase does not support transactions, maybe refactor this to a RPC function
      await supabase
        .from('job_advertisement')
        .upsert(jobAdvertisement, { onConflict: 'resume_id' })
        .select();

      await supabase
        .from('resume')
        .update({
          last_updated: new Date().toISOString(),
        })
        .eq('id', resumeId);

      stepper.next();
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: handle form submission
    const { jobAdvertisement } = values;

    await submitJobAdvertisement(jobAdvertisement);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Job Advertisement</CardTitle>
            <CardDescription>
              Copy the Job Advertisement Text in here to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="jobAdvertisement"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} className="min-h-[250px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end py-2">
          <SubmitButton text="Next" pending={form.formState.isSubmitting} />
        </div>
      </form>
    </Form>
  );
}
