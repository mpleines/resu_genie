'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import { useScrollToTop } from '@/lib/useScrollToTop';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SkeletonInput } from './SkeletonInputs';
import StepperFooter from './StepperFooter';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone_1: z.string(),
  address: z.string(),
  city: z.string(),
  professional_experience_in_years: z
    .number()
    .positive({ message: 'Number must be positive' })
    .nullable(),
});

export default function PersonalInformationForm() {
  useScrollToTop();

  const supabase = createClient();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const personalInfo = await fetchPersonalInfo();

      return {
        name: personalInfo?.name ?? '',
        phone_1: personalInfo?.phone_1 ?? '',
        address: personalInfo?.address ?? '',
        city: personalInfo?.city ?? '',
        professional_experience_in_years:
          personalInfo?.professional_experience_in_years ?? null,
      };
    },
  });

  async function fetchPersonalInfo() {
    if (userId == null) {
      return;
    }

    const { data } = await supabase
      .from('personal_information')
      .select()
      .eq('user_id', userId)
      .eq('resume_id', resumeId)
      .limit(1)
      .single();

    return data;
  }

  async function submitPersonalInfo(personalInfo: z.infer<typeof formSchema>) {
    const personalInformation: Database['public']['Tables']['personal_information']['Insert'] =
      {
        ...personalInfo,
        user_id: userId,
        resume_id: resumeId,
      };

    try {
      await supabase.from('personal_information').upsert(personalInformation, {
        onConflict: 'resume_id',
      });
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitPersonalInfo)}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Enter you Contact Information to start
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <SkeletonInput
                      {...field}
                      isLoading={form.formState.isLoading}
                      disabled={form.formState.isSubmitting}
                      placeholder="Your Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <SkeletonInput
                      {...field}
                      isLoading={form.formState.isLoading}
                      disabled={form.formState.isSubmitting}
                      placeholder="Your Phone Number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <SkeletonInput
                      {...field}
                      isLoading={form.formState.isLoading}
                      disabled={form.formState.isSubmitting}
                      placeholder="Your Street"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <SkeletonInput
                      {...field}
                      isLoading={form.formState.isLoading}
                      disabled={form.formState.isSubmitting}
                      placeholder="Your City"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professional_experience_in_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Experience in Years</FormLabel>
                  <FormControl>
                    <SkeletonInput
                      {...field}
                      isLoading={form.formState.isLoading}
                      disabled={form.formState.isSubmitting}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      placeholder="Your Professional Experience in Years"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <StepperFooter isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
}
