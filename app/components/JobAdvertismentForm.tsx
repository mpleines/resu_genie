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
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileTextIcon, LinkIcon, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AlertDestructive } from './AlertDestructive';
import AlertSuccess from './AlertSuccess';
import { useTranslations } from 'next-intl';
import { useStepper } from '@/hooks/useStepper';

const formSchema = z.object({
  jobAdvertisement: z.string().min(1, { message: 'This field is required' }),
});

const crawlerFormSchema = z.object({
  jobUrl: z.string().min(1).url(),
});

type InputMethod = 'url' | 'manual';

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
  const t = useTranslations('jobAdvertisement');

  const [crawlStatus, setCrawlStatus] = useState<
    'not-started' | 'pending' | 'success' | 'failed'
  >('not-started');

  const [inputMethod, setInputMethod] = useState<InputMethod>('url');

  const crawlerForm = useForm<z.infer<typeof crawlerFormSchema>>({
    resolver: zodResolver(crawlerFormSchema),
    defaultValues: {
      jobUrl: '',
    },
  });
  const submitForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobAdvertisement: initialData?.text ?? '',
    },
  });
  const submitFormRef = useRef<HTMLFormElement>(null);

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

  async function crawlJobAd(values: z.infer<typeof crawlerFormSchema>) {
    const url = encodeURIComponent(values.jobUrl);
    setCrawlStatus('pending');
    const response = await fetch(`/api/crawl-job/?url=${url}`);
    const json = await response.json();
    const { content } = json;

    if (!content) {
      setCrawlStatus('failed');
      return;
    }

    submitForm.reset({
      jobAdvertisement: content,
    });
    setCrawlStatus('success');
  }

  function clear() {
    setCrawlStatus('not-started');
    crawlerForm.reset({ jobUrl: '' });
    submitForm.reset({ jobAdvertisement: '' });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="url"
            className="w-full"
            onValueChange={(value) => setInputMethod(value as InputMethod)}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span>{t('jobUrl')}</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                <span>{t('manualEntry')}</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="job-url">{t('jobUrl')}</Label>
                <Form {...crawlerForm}>
                  <form
                    onSubmit={crawlerForm.handleSubmit(crawlJobAd)}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap md:flex-nowrap items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0">
                      <FormField
                        control={crawlerForm.control}
                        name="jobUrl"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://example.com/job-posting"
                                disabled={crawlStatus === 'success'}
                                autoFocus
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        className="flex-1 md:flex-0"
                        disabled={
                          crawlStatus === 'pending' || crawlStatus === 'success'
                        }
                      >
                        {crawlStatus === 'pending' && (
                          <Loader2 className="animate-spin" />
                        )}
                        Submit URL
                      </Button>
                    </div>
                  </form>
                </Form>
                {crawlerForm.formState.errors.jobUrl && (
                  <span className="text-red-600 text-sm">
                    {crawlerForm.formState.errors.jobUrl.message}
                  </span>
                )}
                <p className="text-sm text-muted-foreground">
                  {t('jobUrlDescription')}
                </p>
              </div>

              {crawlStatus === 'success' && (
                <AlertSuccess message={t('crawlSuccess')} />
              )}

              {crawlStatus === 'failed' && (
                <AlertDestructive message={t('crawlError')} />
              )}

              {(crawlStatus === 'success' ||
                submitForm.getValues().jobAdvertisement) && (
                <div className="mt-4">
                  <div className="flex items-center justify-between flex-wrap py-2 ">
                    <h3 className="text-lg">{t('title')}</h3>
                    <Button onClick={clear}>{t('clearAndRetry')}</Button>
                  </div>
                  <Form {...submitForm}>
                    <form
                      ref={submitFormRef}
                      onSubmit={submitForm.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={submitForm.control}
                        name="jobAdvertisement"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                disabled
                                {...field}
                                className="bg-muted min-h-[250px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
              )}
            </TabsContent>
            <TabsContent value="text" className="space-y-4">
              <Form {...submitForm}>
                <form
                  ref={submitFormRef}
                  onSubmit={submitForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={submitForm.control}
                    name="jobAdvertisement"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="min-h-[250px]"
                            {...field}
                            disabled={submitForm.formState.isSubmitting}
                            placeholder={t('description')}
                          />
                        </FormControl>
                        <FormMessage />

                        <p className="text-sm text-muted-foreground">
                          {t('manualDescription')}
                        </p>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <StepperFooter
        formRef={submitFormRef}
        showBackButton={false}
        isSubmitting={submitForm.formState.isSubmitting}
        isDisabled={inputMethod === 'url' && !submitForm.formState.isValid}
      />
    </>
  );
}
