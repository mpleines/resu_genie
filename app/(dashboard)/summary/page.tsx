import { supabaseClientServer } from '@/app/layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// FIXME: this is just a placeholder, needs heavy refactoring and re-styling

export default async function Page() {
  // FIXME: this produces a wrong type somehow, it is returning a single entity for the joined tables, not an array
  const { data } = await supabaseClientServer
    .from('resume')
    .select(
      `
      job_advertisement (text),
      personal_information (name),
      skills (skill_name),
      work_experience (organisation_name, profile, start_date, end_date),
      education (institute_name, start_date, end_date)
    `
    )
    .eq('id', 1) // TODO: get resume id
    .single();

  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-xl">Summary</h1>
      <div>
        <h2>Job Advertisement</h2>
        <Textarea disabled value={data?.job_advertisement.text} />
      </div>
      <div>
        <h2>Personal Information</h2>
        <div>
          <Label>Name</Label>
          <Input disabled value={data?.personal_information.name} />
        </div>
      </div>
      <div>
        <h2>Skills</h2>
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

      <div className="flex justify-end">
        <Button>Generate Resume </Button>
      </div>
    </div>
  );
}
