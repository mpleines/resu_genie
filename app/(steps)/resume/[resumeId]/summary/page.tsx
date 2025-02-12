'use client';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createResumePrompt,
  ResumeData,
  ResumeResponse,
} from '@/lib/promptHelper';
import openAiClient from '@/lib/openaiClient';
import { useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import BackButton from '@/app/components/BackButton';
import { useScrollToTop } from '@/lib/useScrollToTop';
import {
  SkeletonInput,
  SkeletonTextArea,
} from '@/app/components/SkeletonInputs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page({ params }: { params: { resumeId: string } }) {
  const resumeId = Number(params.resumeId as string);
  const session = useSession();
  const supabase = createClient();
  const router = useRouter();

  useScrollToTop();

  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('resume')
        .select(
          `
          job_advertisement (text),
          personal_information (name, phone_1, address, city, professional_experience_in_years),
          skills (skill_name),
          work_experience (organisation_name, profile, job_description ,start_date, end_date),
          education (institute_name, degree, start_date, end_date)
        `
        )
        .eq('id', resumeId)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        // FIXME: type
        const nonNullData = {
          ...data,
          job_advertisement: data.job_advertisement?.text,
          skills: data.skills.map((skill) => skill.skill_name),
          personal_information: {
            ...data.personal_information,
            email: session.data?.user?.email,
          },
        } as {
          job_advertisement: string;
          personal_information: {
            name: string;
            phone_1: string;
            address: string;
            city: string;
            professional_experience_in_years: number;
            email: string;
          };
          skills: string[];
          work_experience: {
            organisation_name: string;
            profile: string;
            start_date: string;
            end_date: string;
          }[];
          education: {
            institute_name: string;
            start_date: string;
            end_date: string;
          }[];
        };

        setData(nonNullData);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [resumeId]);

  async function generateResume() {
    // FIXME: type errors
    const resumePromptData = {
      job_advertisement: data?.job_advertisement ?? '',
      personal_information: {
        ...data?.personal_information!,
        email: session.data?.user?.email!,
      },
      skills: data?.skills!,
      work_experience: data?.work_experience!,
      education: data?.education ?? [],
    };

    setLoading(true);

    const prompt = createResumePrompt(resumePromptData);
    const response = await openAiClient.completions(prompt);
    const resumeResponseStr = response.data.choices[0].message.content;
    const resumeData: ResumeResponse = JSON.parse(resumeResponseStr);

    // save resume data to supabase
    try {
      await supabase
        .from('resume')
        .update({
          chat_gpt_response_raw: resumeData,
          last_updated: new Date().toISOString(),
        })
        .eq('id', resumeId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      // navigate to resume page
      router.push(`/resume/${resumeId}/download-resume`);
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl">Summary</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonTextArea
            isLoading={initialLoading}
            disabled
            className="min-h-[250px]"
            value={data?.job_advertisement}
          />
        </CardContent>
      </Card>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <SkeletonInput
                isLoading={initialLoading}
                disabled
                id="name"
                name="name"
                placeholder="Your Name"
                defaultValue={data?.personal_information?.name ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <SkeletonInput
                isLoading={initialLoading}
                disabled
                id="email"
                name="email"
                placeholder="Your E-Mail"
                defaultValue={session?.data?.user?.email ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <SkeletonInput
                isLoading={initialLoading}
                disabled
                id="phone"
                name="phone"
                placeholder="Your Phone Number"
                defaultValue={data?.personal_information?.phone_1 ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="street">Street</Label>
              <SkeletonInput
                isLoading={initialLoading}
                disabled
                id="street"
                name="street"
                placeholder="Your Street"
                defaultValue={data?.personal_information?.address ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <SkeletonInput
                isLoading={initialLoading}
                disabled
                id="city"
                name="city"
                placeholder="Your City"
                defaultValue={data?.personal_information?.city ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="professional-experience">
                Professional Experience in Years
              </Label>
              <SkeletonInput
                isLoading={initialLoading}
                disabled
                name="professional-experience"
                id="professional-experience"
                placeholder="Your Professional Experience in Years"
                defaultValue={
                  data?.personal_information
                    ?.professional_experience_in_years ?? ''
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {initialLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="ml-2 w-16 h-6 rounded-lg " />
              ))}
            {!initialLoading &&
              data?.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {initialLoading && (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            )}
            {!initialLoading &&
              data?.work_experience != null &&
              data?.work_experience?.length > 0 &&
              data?.work_experience
                ?.sort(
                  (a, b) =>
                    new Date(b.start_date!).getTime() -
                    new Date(a.start_date!).getTime()
                )
                .map((workExperience) => (
                  <div key={workExperience.profile}>
                    <div className="flex items-center">
                      <div className="flex-1 flex flex-col border-b border-b-border py-2">
                        <p className="text-lg font-semibold">
                          {workExperience.organisation_name}
                        </p>
                        <p className="text-sm opacity-70">
                          {workExperience.profile}
                        </p>
                        <p className="text-sm opacity-70">
                          {workExperience.job_description}
                        </p>
                        <p className="text-sm opacity-70">
                          {formatDate(workExperience.start_date!, 'yyyy-MM-dd')}{' '}
                          - {formatDate(workExperience.end_date!, 'yyyy-MM-dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {initialLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="ml-2 w-16 h-6 rounded-lg " />
              ))}
            {!initialLoading &&
              data?.education != null &&
              data?.education?.length > 0 &&
              data?.education
                ?.sort(
                  (a, b) =>
                    new Date(b.start_date!).getTime() -
                    new Date(a.start_date!).getTime()
                )
                .map((education) => (
                  <div key={education.institute_name}>
                    <div className="flex items-center">
                      <div className="flex-1 flex flex-col border-b border-b-border pb-4">
                        <p className="text-lg font-semibold">
                          {education.institute_name}
                        </p>
                        <p className="text-sm opacity-70">{education.degree}</p>
                        <p className="text-sm opacity-70">
                          {formatDate(education.start_date!, 'yyyy-MM-dd')} -{' '}
                          {formatDate(education.end_date!, 'yyyy-MM-dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <BackButton />
        <Button type="button" onClick={generateResume}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-6 w-6 mr-2" />
          )}
          Generate Resume
        </Button>
      </div>
    </div>
  );
}
