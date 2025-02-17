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
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonTextArea } from './SkeletonInputs';
import StepperFooter from './StepperFooter';

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Job Advertisement</CardTitle>
            <CardDescription>
              Copy the Job Advertisement Text in here to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {form.formState.isLoading && (
              <Skeleton className="w-full h-[250px]" />
            )}
            {!form.formState.isLoading && (
              <FormField
                control={form.control}
                name="jobAdvertisement"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SkeletonTextArea
                        isLoading={form.formState.isLoading}
                        className="min-h-[250px]"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>
        <StepperFooter
          showBackButton={false}
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
