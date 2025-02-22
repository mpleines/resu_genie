'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useSession } from 'next-auth/react';
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
import StepperFooter from './StepperFooter';
import { JobAdvertisement } from '@/types/types';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  jobAdvertisement: z.string().min(1, { message: 'This field is required' }),
});

type Props = {
  initialData: JobAdvertisement | null;
};

export default function JobAdvertisementForm({ initialData }: Props) {
  useScrollToTop();

  const session = useSession();
  const userId = session?.data?.user?.id;
  const supabase = createClient();
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobAdvertisement: initialData?.text ?? '',
    },
  });

  async function submitJobAdvertisement(jobAd: string) {
    if (userId == null) {
      return;
    }

    const jobAdvertisement = {
      text: jobAd,
      user_id: userId,
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
        .eq('id', resumeId)
        .eq('user_id', userId);

      stepper.next();
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
            <FormField
              control={form.control}
              name="jobAdvertisement"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[250px]"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
