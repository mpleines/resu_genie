import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import supabaseClient from '@/lib/supabase/server';
import { fetchSummary } from '@/lib/supabase/queries';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SubmitResume } from './SubmitResume';

export default async function Page({
  params,
}: {
  params: { resumeId: string };
}) {
  const resumeId = Number(params.resumeId as string);
  const session = await auth();
  const userId = session?.user?.id;
  const supabase = supabaseClient(cookies);

  if (!userId || !resumeId) {
    return notFound();
  }

  const { data, error: summaryError } = await fetchSummary({
    supabaseClient: supabase,
    userId,
    resumeId: resumeId.toString(),
  });

  if (data == null) {
    return notFound();
  }

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl">Summary</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            disabled
            className="min-h-[250px]"
            value={data?.job_advertisement.text}
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
              <Input
                disabled
                id="name"
                name="name"
                placeholder="Your Name"
                defaultValue={data?.personal_information?.name ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                disabled
                id="email"
                name="email"
                placeholder="Your E-Mail"
                defaultValue={session?.user?.email ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                disabled
                id="phone"
                name="phone"
                placeholder="Your Phone Number"
                defaultValue={data?.personal_information?.phone_1 ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                disabled
                id="street"
                name="street"
                placeholder="Your Street"
                defaultValue={data?.personal_information?.address ?? ''}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
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
            {data?.skills?.map((skill) => (
              <Badge key={skill.skill_name} variant="secondary">
                {skill.skill_name}
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
            {data?.work_experience != null &&
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
            {data?.education != null &&
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="mx-auto max-w-screen-2xl flex justify-end px-0 md:px-4">
          <BackButton />

          <SubmitResume
            resumeId={params.resumeId}
            data={data}
            user={session.user!}
          />
        </div>
      </footer>
    </div>
  );
}
