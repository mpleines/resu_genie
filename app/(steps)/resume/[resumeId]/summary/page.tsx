'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export default function Page({ params }: { params: { resumeId: string } }) {
  const resumeId = Number(params.resumeId as string);
  const session = useSession();
  const supabase = createClient();
  const router = useRouter();

  useScrollToTop();

  const [data, setData] = useState<ResumeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('resume')
        .select(
          `
          job_advertisement (text),
          personal_information (name, phone_1, address, city, professional_experience_in_years),
          skills (skill_name),
          work_experience (organisation_name, profile, start_date, end_date),
          education (institute_name, start_date, end_date)
        `
        )
        .eq('id', resumeId)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      setData(data);
    };

    fetchData();
  }, [resumeId]);

  async function generateResume() {
    // FIXME: type errors
    const resumePromptData: ResumeData = {
      job_advertisement: data?.job_advertisement.text ?? '',
      personal_information: {
        ...data?.personal_information,
        email: session?.user?.email!,
      },
      skills: data?.skills,
      work_experience: data?.work_experience,
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
    <form>
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl">Summary</h1>
        <Card>
          <CardHeader>
            <CardTitle>Job Advertisement</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea disabled value={data?.job_advertisement.text} />
          </CardContent>
        </Card>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="name">Name</Label>
              <Input
                disabled
                id="name"
                name="name"
                placeholder="Your Name"
                defaultValue={data?.personal_information?.name ?? ''}
              />
              <Label htmlFor="email">E-Mail</Label>
              <Input
                disabled
                id="email"
                name="email"
                placeholder="Your E-Mail"
                defaultValue={session?.user?.email ?? ''}
              />
              <Label htmlFor="phone">Phone</Label>
              <Input
                disabled
                id="phone"
                name="phone"
                placeholder="Your Phone Number"
                defaultValue={data?.personal_information?.phone_1 ?? ''}
              />
              {/* <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Your Email" defaultValue={data?.personal_informationrmation?.email ?? ''}/> */}
              <Label htmlFor="street">Street</Label>
              <Input
                disabled
                id="street"
                name="street"
                placeholder="Your Street"
                defaultValue={data?.personal_information?.address ?? ''}
              />
              <Label htmlFor="city">City</Label>
              <Input
                disabled
                id="city"
                name="city"
                placeholder="Your City"
                defaultValue={data?.personal_information?.city ?? ''}
              />
              <Label htmlFor="professional-experience">
                Professional Experience in Years
              </Label>
              <Input
                disabled
                name="professional-experience"
                id="professional-experience"
                placeholder="Your Professional Experience in Years"
                defaultValue={
                  data?.personal_information
                    ?.professional_experience_in_years ?? ''
                }
              />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data?.skills?.map((skill) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.skill_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.work_experience != null &&
                data?.work_experience?.length > 0 &&
                data?.work_experience
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
                            {formatDate(
                              workExperience.start_date!,
                              'yyyy-MM-dd'
                            )}{' '}
                            -{' '}
                            {formatDate(workExperience.end_date!, 'yyyy-MM-dd')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.education != null &&
                data?.education?.length > 0 &&
                data?.education
                  ?.sort(
                    (a, b) =>
                      new Date(b.start_date!).getTime() -
                      new Date(a.start_date!).getTime()
                  )
                  .map((education) => (
                    <div key={education.id}>
                      <div className="flex items-center">
                        <div className="flex-1 flex flex-col border-b border-b-border pb-4">
                          <p className="text-lg font-semibold">
                            {education.institute_name}
                          </p>
                          <p className="text-sm opacity-70">
                            {/* {education.score} */}
                          </p>
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
        <div className="flex justify-end py-2">
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
    </form>
  );
}
