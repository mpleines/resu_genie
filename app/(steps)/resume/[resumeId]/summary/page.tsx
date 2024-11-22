import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { getServerSession } from 'next-auth';
import {
  createResumePrompt,
  ResumeData,
  ResumeResponse,
} from '@/lib/promptHelper';
import openAiClient from '@/lib/openaiClient';
import SubmitButton from '@/app/components/SubmitButton';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import supabaseClient from '@/lib/supabase/server';

export default async function Page({
  params,
}: {
  params: { resumeId: string };
}) {
  const resumeId = Number(params.resumeId as string);

  const session = await getServerSession();
  // FIXME: this produces a wrong type somehow, it is returning a single entity for the joined tables, not an array
  const { data } = await supabaseClient
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
    .single();

  async function generateResume() {
    'use server';

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

    const prompt = createResumePrompt(resumePromptData);
    const response = await openAiClient.completions(prompt);
    const resumeResponseStr = response.data.choices[0].message.content;
    const resumeData: ResumeResponse = JSON.parse(resumeResponseStr);

    // save resume data to supabase
    try {
      await supabaseClient
        .from('resume')
        .update({
          chat_gpt_response_raw: resumeData,
        })
        .eq('id', resumeId);
    } catch (error) {
      console.error(error);
    } finally {
      // navigate to resume page
      redirect(`/resume/${resumeId}/download-resume`);
    }
  }

  return (
    <form action={generateResume}>
      <div className="flex justify-center">
        <SubmitButton
          text="Generate Resume"
          icon={<FileText className="h-6 w-6 mr-2" />}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl">Summary</h1>
        <div>
          <h2>Job Advertisement</h2>
          <Textarea disabled value={data?.job_advertisement.text} />
        </div>
        <div>
          <h2>Personal Information</h2>
          <Card>
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
        <h2>Skills</h2>
        <div className="flex gap-2">
          {data?.skills?.map((skill) => (
            <Badge key={skill.id} variant="secondary">
              {skill.skill_name}
            </Badge>
          ))}
        </div>
        <div>
          <h2>Work Experience</h2>
          <Card className="mt-4">
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
          <h2>Education</h2>
          <Card className="mt-4">
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
        <div>
          <Link href="/education">
            <Button variant="outline" className="mr-2">
              Back
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
