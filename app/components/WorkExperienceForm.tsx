'use client';

import { useCallback, useEffect, useState } from 'react';
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
import SubmitButton from './SubmitButton';
import { useParams } from 'next/navigation';
import { formatDate } from 'date-fns';
import { useStepper } from '../(steps)/useStepper';
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

const formSchema = z.object({
  organisation_name: z.string().min(1, { message: 'This field is required' }),
  profile: z.string().min(1, { message: 'This field is required' }),
  start_date: z.date(),
  end_date: z.date().optional(),
});

export default function WorkExperienceForm() {
  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

  const [workExperiences, setWorkExperiences] = useState<
    Database['public']['Tables']['work_experience']['Row'][]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisation_name: '',
      profile: '',
      start_date: new Date(),
      end_date: new Date(),
    },
  });

  const submitForm = useForm({});

  const fetchWorkExperiences = useCallback(async () => {
    const { data } = await supabase
      .from('work_experience')
      .select()
      .eq('resume_id', resumeId);

    setWorkExperiences(data ?? []);
  }, [supabase, resumeId]);

  useEffect(() => {
    fetchWorkExperiences();
  }, [fetchWorkExperiences, supabase, userEmail]);

  async function addExperience(formData: z.infer<typeof formSchema>) {
    const workExperience = formData;

    const workExperienceToInsert: Database['public']['Tables']['work_experience']['Insert'] =
      {
        organisation_name: workExperience.organisation_name,
        profile: workExperience.profile,
        start_date: workExperience.start_date?.toISOString(),
        end_date: workExperience.end_date?.toISOString(),
        user_id: userEmail,
        resume_id: resumeId,
      };

    await supabase.from('work_experience').insert(workExperienceToInsert);
    await supabase
      .from('resume')
      .update({
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId);

    submitForm.reset({});
    form.reset({
      organisation_name: '',
      profile: '',
      start_date: new Date(),
      end_date: new Date(),
    });

    await fetchWorkExperiences();
  }

  async function deleteWorkExperience(id: number) {
    await supabase.from('work_experience').delete().eq('id', id);
    await fetchWorkExperiences();
  }

  async function submitWorkExperience() {
    if (workExperiences.length === 0) {
      submitForm.setError('root', {
        message: 'Please add at least one work experience',
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addExperience)}>
          <Card>
            <CardHeader>
              <CardTitle>Add Work Experience</CardTitle>
              <CardDescription>
                Add your previous work experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="organisation_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Company Name" />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormMessage>
                {form.formState.errors.organisation_name?.message}
              </FormMessage>

              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Profile/Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="profile" />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormMessage>
                {form.formState.errors.profile?.message}
              </FormMessage>

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex flex-col my-2 space-y-2">
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            {...field}
                            onSelect={(date) =>
                              form.setValue('start_date', date!)
                            }
                          />
                        </FormControl>
                      </div>
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
                        <div className="flex flex-col my-2 space-y-2">
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              {...field}
                              onSelect={(date) =>
                                form.setValue('end_date', date!)
                              }
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button>Add Work Experience</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <div className="flex-1 flex flex-col border-b border-b-border pb-4">
                      <p className="text-lg font-semibold">
                        {workExperience.organisation_name}
                      </p>
                      <p className="text-sm opacity-70">
                        {workExperience.profile}
                      </p>
                      <p className="text-sm opacity-70">
                        {formatDate(workExperience.start_date!, 'yyyy-MM-dd')} -{' '}
                        {formatDate(workExperience.end_date!, 'yyyy-MM-dd')}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteWorkExperience(workExperience.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}

          {workExperiences?.length === 0 && (
            <p className="text-sm opacity-70">No work experience added yet</p>
          )}
        </CardContent>
      </Card>
      <Form {...submitForm}>
        <form onSubmit={submitForm.handleSubmit(submitWorkExperience)}>
          <div className="flex justify-end py-2">
            <BackButton />
            <SubmitButton
              text="Next"
              pending={submitForm.formState.isSubmitting}
            />
          </div>
          <FormMessage>{submitForm.formState.errors.root?.message}</FormMessage>
        </form>
      </Form>
    </>
  );
}
