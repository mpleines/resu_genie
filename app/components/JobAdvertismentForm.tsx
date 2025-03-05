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
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileTextIcon, LinkIcon, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AlertDestructive } from './AlertDestructive';
import AlertSuccess from './AlertSuccess';

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

  const [crawlStatus, setCrawlStatus] = useState<
    'not-started' | 'pending' | 'success' | 'failed'
  >('not-started');
  const [crawlerUrl, setCrawlerUrl] = useState('');

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

  async function crawlJobAd() {
    const url = encodeURIComponent(crawlerUrl);
    setCrawlStatus('pending');
    const response = await fetch(`/api/crawl-job/?url=${url}`);
    const json = await response.json();
    const { content } = json;

    if (!content) {
      setCrawlStatus('failed');
      return;
    }

    form.reset({
      jobAdvertisement: content,
    });
    setCrawlStatus('success');
  }

  function clear() {
    setCrawlStatus('not-started');
    setCrawlerUrl('');
    form.reset({ jobAdvertisement: '' });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Job Advertisement</CardTitle>
            <CardDescription>
              Paste a link to a job advertisement or enter the job details
              manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>Job URL</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  <span>Manual Entry</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="job-url">Job Advertisement URL</Label>
                  <Input
                    id="job-url"
                    placeholder="https://example.com/job-posting"
                    value={crawlerUrl}
                    onChange={(e) => setCrawlerUrl(e.target.value)}
                    disabled={crawlStatus === 'success'}
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste a link to the job advertisement you want to create a
                    resume for
                  </p>
                </div>

                {crawlStatus !== 'success' && (
                  <Button
                    type="button"
                    className="w-full md:w-1/4 self-end"
                    onClick={crawlJobAd}
                    disabled={crawlStatus === 'pending' || !crawlerUrl}
                  >
                    {crawlStatus === 'pending' && (
                      <Loader2 className="animate-spin" />
                    )}
                    Submit URL
                  </Button>
                )}

                {crawlStatus === 'success' && (
                  <AlertSuccess message="Job advertisement successfully fetched!" />
                )}

                {crawlStatus === 'failed' && (
                  <AlertDestructive message="Could not fetch job advertisement" />
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between flex-wrap py-2 ">
                    <h3 className="text-lg">Job Advertisement</h3>
                    <Button onClick={clear}>Clear & Try another</Button>
                  </div>
                  <FormField
                    control={form.control}
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
                </div>
              </TabsContent>
              <TabsContent value="text" className="space-y-4">
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
                          placeholder="Paste in the job advertisement here manually"
                        />
                      </FormControl>
                      <FormMessage />

                      <p className="text-sm text-muted-foreground">
                        Enter the complete job description including
                        requirements, responsibilities, and any other details
                      </p>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
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
