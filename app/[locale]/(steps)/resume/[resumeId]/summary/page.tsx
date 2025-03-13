import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import { auth } from '@/auth';
import supabaseClient from '@/lib/supabase/server';
import { fetchSummary } from '@/lib/supabase/queries';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SubmitResume } from './SubmitResume';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function Page(props: {
  params: Promise<{ resumeId: string }>;
}) {
  const params = await props.params;
  const resumeId = Number(params.resumeId as string);
  const session = await auth();
  const userId = session?.user?.id;
  const supabase = supabaseClient();
  const t = await getTranslations();

  if (!userId || !resumeId) {
    return notFound();
  }

  const { data } = await fetchSummary({
    supabaseClient: supabase,
    userId,
    resumeId: resumeId.toString(),
  });

  if (data == null) {
    return notFound();
  }

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl">{t('summary.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('jobAdvertisement.title')}</CardTitle>
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
            <CardTitle>{t('personalInformation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('global.name')}</Label>
              <Input
                disabled
                id="name"
                name="name"
                defaultValue={data?.personal_information?.name ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('global.email')}</Label>
              <Input
                disabled
                id="email"
                name="email"
                defaultValue={session?.user?.email ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('global.phone')}</Label>
              <Input
                disabled
                id="phone"
                name="phone"
                defaultValue={data?.personal_information?.phone_1 ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">{t('global.street')}</Label>
              <Input
                disabled
                id="street"
                name="street"
                defaultValue={data?.personal_information?.address ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t('global.city')}</Label>
              <Input
                disabled
                id="city"
                name="city"
                defaultValue={data?.personal_information?.city ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional-experience">
                {t('global.professionalExperienceInYears')}
              </Label>
              <Input
                disabled
                name="professional-experience"
                id="professional-experience"
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
          <CardTitle>{t('skills.title')}</CardTitle>
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
            <CardTitle>{t('workExperience.title')}</CardTitle>
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
                          {formatDate(new Date(workExperience.start_date!))} -{' '}
                          {formatDate(new Date(workExperience.end_date!))}
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
            <CardTitle>{t('education.title')}</CardTitle>
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
                          {formatDate(new Date(education.start_date!))} -{' '}
                          {formatDate(new Date(education.end_date!))}
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
