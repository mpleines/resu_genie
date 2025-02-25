'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/app/components/DatePicker';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Database } from '@/types/supabase';
import { Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import { useStepper } from '../(steps)/useStepper';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertDestructive } from './AlertDestructive';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import StepperFooter from './StepperFooter';
import { fetchWorkExperiences } from '@/lib/supabase/queries';
import { WorkExperience } from '@/types/types';
import useScrollToElement from '@/hooks/useScrollToElement';
import { formatDate } from '@/lib/utils';

const formSchema = z.object({
  organisation_name: z.string().min(1, { message: 'This field is required' }),
  profile: z.string().min(1, { message: 'This field is required' }),
  job_description: z.string(),
  start_date: z.date(),
  end_date: z.date().optional(),
});

export default function WorkExperienceForm() {
  const supabase = createClient();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

  const { ref, scrollToElement: scrollToError } = useScrollToElement();

  const [workexperiencesLoading, setWorkexperiencesLoading] = useState(true);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisation_name: '',
      profile: '',
      job_description: '',
      start_date: new Date(),
      end_date: new Date(),
    },
  });

  const submitForm = useForm({});

  const fetchAndSetWorkExperiences = useCallback(() => {
    if (!userId || !resumeId) {
      return;
    }

    fetchWorkExperiences({
      supabaseClient: supabase,
      userId,
      resumeId: resumeId.toString(),
    }).then((response) => {
      setWorkExperiences(response.data ?? []);
      setWorkexperiencesLoading(false);
    });
  }, [
    resumeId,
    setWorkExperiences,
    setWorkexperiencesLoading,
    supabase,
    userId,
  ]);

  useEffect(() => {
    fetchAndSetWorkExperiences();
  }, [fetchAndSetWorkExperiences]);

  async function addExperience(formData: z.infer<typeof formSchema>) {
    const workExperience = formData;

    const workExperienceToInsert: Database['public']['Tables']['work_experience']['Insert'] =
      {
        organisation_name: workExperience.organisation_name,
        profile: workExperience.profile,
        job_description: workExperience.job_description,
        start_date: workExperience.start_date?.toISOString(),
        end_date: workExperience.end_date?.toISOString(),
        user_id: userId,
        resume_id: resumeId,
      };

    await supabase.from('work_experience').insert(workExperienceToInsert);
    await supabase
      .from('resume')
      .update({
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', userId!);

    submitForm.reset({});
    form.reset({
      organisation_name: '',
      profile: '',
      job_description: '',
      start_date: new Date(),
      end_date: new Date(),
    });

    fetchAndSetWorkExperiences();
  }

  async function deleteWorkExperience(id: number) {
    await supabase.from('work_experience').delete().eq('id', id);
    fetchAndSetWorkExperiences();
  }

  async function submitWorkExperience() {
    if (userId == null) {
      return;
    }

    if (workExperiences.length === 0) {
      submitForm.setError('root', {
        message: 'Please add at least one work experience',
      });

      scrollToError();
      return;
    }

    await supabase
      .from('resume')
      .update({
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', userId);

    stepper.next();
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addExperience)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Work Experience</CardTitle>
              <CardDescription>
                Add your previous work experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="organisation_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Company Name"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={form.formState.isSubmitting}
                          placeholder="e.g. Software Engineer, Data Scientist, Salesman, Plumber,... "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="job_description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormDescription>
                        Briefly describe what you did at the company here
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={form.formState.isSubmitting}
                          placeholder="e.g. Built a website for the company, managed the team at the company, created a new product for the company"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex flex-col my-2">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>

                        <FormControl>
                          <div>
                            <DatePicker
                              {...field}
                              disabled={form.formState.isSubmitting}
                              onSelect={(date) =>
                                form.setValue('start_date', date!)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="flex flex-col my-2">
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div>
                              <DatePicker
                                {...field}
                                disabled={form.formState.isSubmitting}
                                onSelect={(date) =>
                                  form.setValue('end_date', date!)
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button disabled={form.formState.isSubmitting}>
                  Add Work Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {workexperiencesLoading && (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          )}

          {!workexperiencesLoading && workExperiences?.length === 0 && (
            <p className="text-sm opacity-70 h-24">
              No work experience added yet
            </p>
          )}

          {workExperiences != null &&
            workExperiences?.length > 0 &&
            workExperiences
              ?.sort(
                (a, b) =>
                  new Date(b.start_date!).getTime() -
                  new Date(a.start_date!).getTime()
              )
              .map((workExperience) => (
                <div key={workExperience.id}>
                  <div className="flex items-center">
                    <div className="flex-1 flex flex-col border-b border-b-border py-2">
                      {/* render the actual data */}
                      <p className="text-lg font-semibold">
                        {workExperience.organisation_name}
                      </p>
                      <p className="text-sm opacity-70">
                        {workExperience.profile}
                      </p>
                      <p className="text-sm opacity-70">
                        {(workExperience.job_description?.length ?? 0) > 45
                          ? workExperience.job_description?.slice(0, 45) + '...'
                          : workExperience.job_description}
                      </p>
                      <p className="text-sm opacity-70">
                        {formatDate(new Date(workExperience.start_date!))} -{' '}
                        {formatDate(new Date(workExperience.end_date!))}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteWorkExperience(workExperience.id)}
                      disabled={form.formState.isSubmitting}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
        </CardContent>
      </Card>
      <Form {...submitForm}>
        <form onSubmit={submitForm.handleSubmit(submitWorkExperience)}>
          {submitForm.formState.errors.root?.message && (
            <AlertDestructive
              ref={ref}
              className="my-2"
              message={submitForm.formState.errors.root.message}
            />
          )}
          <StepperFooter isSubmitting={submitForm.formState.isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
