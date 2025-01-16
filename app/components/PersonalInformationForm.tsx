'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import BackButton from './BackButton';
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
  const userEmail = session?.data?.user?.email;
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
    if (userEmail == null) {
      return;
    }

    const { data } = await supabase
      .from('personal_information')
      .select()
      .eq('user_id', userEmail)
      .eq('resume_id', resumeId)
      .limit(1)
      .single();

    return data;
  }

  async function submitPersonalInfo(personalInfo: z.infer<typeof formSchema>) {
    const personalInformation: Database['public']['Tables']['personal_information']['Insert'] =
      {
        ...personalInfo,
        user_id: userEmail,
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
      <form onSubmit={form.handleSubmit(submitPersonalInfo)}>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Enter you Contact Information to start
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Name" />
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
                    <Input {...field} placeholder="Your Phone Number" />
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
                    <Input {...field} placeholder="Your Street" />
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
                    <Input {...field} placeholder="Your City" />
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
                    <Input
                      type="number"
                      {...field}
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
        <div className="flex justify-end py-2">
          <BackButton />
          <SubmitButton text="Next" pending={form.formState.isSubmitting} />
        </div>
      </form>
    </Form>
  );
}
