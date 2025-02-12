'use client';

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
import { useCallback, useEffect, useState } from 'react';
import { formatDate } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import BackButton from './BackButton';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertDestructive } from './AlertDestructive';
import { Skeleton } from '@/components/ui/skeleton';
import StepperFooter from './StepperFooter';

const formSchema = z.object({
  institute_name: z.string().min(1, { message: 'This field is required' }),
  degree: z.string(),
  start_date: z.date(),
  end_date: z.date(),
});

export default function EducationForm() {
  useScrollToTop();
  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const [educationLoading, setEducationLoading] = useState(true);
  const [educations, setEducations] = useState<
    Database['public']['Tables']['education']['Row'][]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institute_name: '',
      degree: '',
      start_date: new Date(),
      end_date: new Date(),
    },
  });
  const submitForm = useForm({});

  const fetchEducation = useCallback(async () => {
    const { data } = await supabase
      .from('education')
      .select()
      .eq('resume_id', resumeId);

    setEducations(data ?? []);
  }, [resumeId, supabase]);

  useEffect(() => {
    fetchEducation().then(() => setEducationLoading(false));
  }, [fetchEducation, userEmail]);

  async function addEducation(education: z.infer<typeof formSchema>) {
    const newEducation: Database['public']['Tables']['education']['Insert'] = {
      institute_name: education.institute_name,
      degree: education.degree,
      start_date: education.start_date.toISOString(),
      end_date: education.end_date.toISOString(),
      user_id: userEmail,
      resume_id: resumeId,
    };

    try {
      await supabase.from('education').insert(newEducation);
      fetchEducation();
      form.reset({
        institute_name: '',
        degree: '',
        start_date: new Date(),
        end_date: new Date(),
      });
      submitForm.reset({});
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteEducation(id: number) {
    try {
      await supabase.from('education').delete().eq('id', id);
      fetchEducation();
    } catch (error) {
      console.error(error);
    }
  }

  async function submitEducation() {
    if (educations.length < 1) {
      submitForm.setError('root', {
        message: 'Please add at least one education',
      });
      return;
    }

    await supabase
      .from('resume')
      .update({
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId);

    stepper.next();
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addEducation)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Education</CardTitle>
              <CardDescription>Add your previous education.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="institute_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={form.formState.isSubmitting}
                          placeholder="Institution Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={form.formState.isSubmitting}
                          placeholder="e.g. Associate in digital photography, Bachelor of Arts, ..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

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

              <div className="flex justify-end mt-6">
                <Button disabled={form.formState.isSubmitting}>
                  Add Education
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {educationLoading && (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              )}

              {!educationLoading && educations?.length === 0 && (
                <p className="text-sm opacity-70 h-24">
                  No Education added yet
                </p>
              )}

              {educations != null &&
                educations?.length > 0 &&
                educations
                  ?.sort(
                    (a, b) =>
                      new Date(b.start_date!).getTime() -
                      new Date(a.start_date!).getTime()
                  )
                  .map((education) => (
                    <div key={education.id}>
                      <div className="flex items-center">
                        <div className="flex-1 flex flex-col border-b border-b-border py-2">
                          <p className="text-lg font-semibold">
                            {education.institute_name}
                          </p>
                          <p className="text-sm opacity-70">
                            {education.degree}
                          </p>
                          <p className="text-sm opacity-70">
                            {formatDate(education.start_date!, 'yyyy-MM-dd')} -{' '}
                            {formatDate(education.end_date!, 'yyyy-MM-dd')}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => deleteEducation(education.id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </form>
      </Form>
      <Form {...submitForm}>
        <form onSubmit={submitForm.handleSubmit(submitEducation)}>
          {submitForm.formState.errors.root?.message && (
            <AlertDestructive
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
