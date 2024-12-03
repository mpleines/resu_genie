'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/app/components/DatePicker';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Database } from '@/types/supabase';
import { Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { createClient } from '@/lib/supabase/client';
import SubmitButton from './SubmitButton';
import { useParams } from 'next/navigation';
import { formatDate } from 'date-fns';
import { useStepper } from '../(steps)/useStepper';
import BackButton from './BackButton';
import { useScrollToTop } from '@/lib/useScrollToTop';

export default function WorkExperienceForm() {
  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

  const [workExperiences, setWorkExperiences] = useState<
    Database['public']['Tables']['work_experience']['Row'][]
  >([]);

  const [workExperience, setWorkExperience] = useState<{
    organisation_name: string;
    profile: string;
    start_date?: Date;
    end_date?: Date;
  }>({
    organisation_name: '',
    profile: '',
    start_date: new Date(),
    end_date: new Date(),
  });

  const fetchWorkExperiences = useCallback(async () => {
    const { data } = await supabase
      .from('work_experience')
      .select()
      .eq('resume_id', resumeId);

    setWorkExperiences(data ?? []);
  }, [supabase, resumeId]);

  useEffect(() => {
    fetchWorkExperiences();
  }, [fetchWorkExperiences, supabase, userEmail]);

  async function addExperience() {
    const workExperienceToInsert: Database['public']['Tables']['work_experience']['Insert'] =
      {
        organisation_name: workExperience.organisation_name,
        profile: workExperience.profile,
        start_date: workExperience.start_date?.toISOString(),
        end_date: workExperience.end_date?.toISOString(),
        user_id: userEmail,
        resume_id: resumeId,
      };

    if (
      !workExperience.organisation_name ||
      !workExperience.profile ||
      !workExperience.start_date ||
      !workExperience.end_date
    ) {
      return;
    }

    await supabase.from('work_experience').insert(workExperienceToInsert);

    setWorkExperience({
      organisation_name: '',
      profile: '',
      start_date: new Date(),
      end_date: new Date(),
    });

    await fetchWorkExperiences();
  }

  async function deleteWorkExperience(id: number) {
    await supabase.from('work_experience').delete().eq('id', id);
    await fetchWorkExperiences();
  }

  async function submitWorkExperience() {
    if (workExperiences.length < 1) {
      return;
    }

    stepper.next();
  }

  return (
    <form action={submitWorkExperience}>
      <Card>
        <CardHeader>
          <CardTitle>Add Work Experience</CardTitle>
          <CardDescription>Add your previous work experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            placeholder="Company Name"
            value={workExperience.organisation_name}
            onChange={(event) =>
              setWorkExperience((prev) => ({
                ...prev,
                organisation_name: event.target.value,
              }))
            }
          />
          <Label htmlFor="profile">Profile/Description</Label>
          <Input
            id="profile"
            name="profile"
            placeholder="profile"
            value={workExperience.profile}
            onChange={(event) =>
              setWorkExperience((prev) => ({
                ...prev,
                profile: event.target.value,
              }))
            }
          />
          <div className="flex flex-col my-2">
            <Label className="mb-1" htmlFor="start_date">
              Start Date
            </Label>
            <DatePicker
              name="start_date"
              value={workExperience.start_date}
              onSelect={(date) => {
                setWorkExperience((prev) => ({
                  ...prev,
                  start_date: date,
                }));
              }}
            />
          </div>
          <div className="flex flex-col my-2">
            <Label className="mb-1" htmlFor="end_date">
              End Date
            </Label>
            <DatePicker
              name="end_date"
              value={workExperience.end_date}
              onSelect={(date) =>
                setWorkExperience((prev) => ({
                  ...prev,
                  end_date: date,
                }))
              }
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button type="button" onClick={addExperience}>
              Add Work Experience
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {workExperiences != null &&
            workExperiences?.length > 0 &&
            workExperiences
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
                        {formatDate(workExperience.start_date!, 'yyyy-MM-dd')} -{' '}
                        {formatDate(workExperience.end_date!, 'yyyy-MM-dd')}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteWorkExperience(workExperience.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}

          {workExperiences?.length === 0 && (
            <p className="text-sm opacity-70">No work experience added yet</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end py-2">
        <BackButton />
        <SubmitButton text="Next" />
      </div>
    </form>
  );
}
