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
import StepperFooter from './StepperFooter';
import { PersonalInformation } from '@/types/types';
import { Input } from '@/components/ui/input';
import { useStepper } from '@/hooks/useStepper';
import { useTranslations } from 'use-intl';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone_1: z.string(),
  address: z.string(),
  city: z.string(),
  professional_experience_in_years: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional(),
});

type Props = {
  initialData: PersonalInformation | null;
};

export default function PersonalInformationForm({ initialData }: Props) {
  useScrollToTop();

  const supabase = createClient();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      phone_1: initialData?.phone_1 ?? '',
      address: initialData?.address ?? '',
      city: initialData?.city ?? '',
      professional_experience_in_years:
        initialData?.professional_experience_in_years ?? '', // FIXME: default value cannot be undefined because controlled input, and has to be string because react-hook-form
    },
  });

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
            <CardTitle>{t('personalInformation.title')}</CardTitle>
            <CardDescription>
              {t('personalInformation.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('global.name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('placeholder.name')}
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
                  <FormLabel>{t('global.phone')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('placeholder.phone')}
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
                  <FormLabel>{t('global.street')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('placeholder.street')}
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
                  <FormLabel>{t('global.city')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder={t('placeholder.city')}
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
                  <FormLabel>
                    {t('global.professionalExperienceInYears')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      type="number"
                      placeholder={t(
                        'placeholder.professionalExperienceInYears'
                      )}
                      min={0}
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
