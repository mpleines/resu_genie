'use client';

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
import { useCallback, useEffect, useState } from 'react';
import { formatDate } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';

export default function EducationForm() {
  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const [education, setEducation] = useState<{
    institute_name: string;
    start_date?: Date;
    end_date?: Date;
  }>({
    institute_name: '',
    start_date: new Date(),
    end_date: new Date(),
  });

  const [educations, setEducations] = useState<
    Database['public']['Tables']['education']['Row'][]
  >([]);

  const fetchEducation = useCallback(async () => {
    const { data } = await supabase
      .from('education')
      .select()
      .eq('resume_id', resumeId);

    setEducations(data ?? []);
  }, [resumeId, supabase]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation, userEmail]);

  async function addEducation() {
    if (
      !education?.institute_name ||
      !education?.start_date ||
      !education?.end_date ||
      !userEmail
    ) {
      console.error('Missing required fields');
      return;
    }

    const newEducation = {
      institute_name: education.institute_name,
      start_date: education.start_date.toISOString(),
      end_date: education.end_date.toISOString(),
      user_id: userEmail,
      resume_id: resumeId,
    };

    try {
      await supabase.from('education').insert(newEducation);
      fetchEducation();
      setEducation({
        institute_name: '',
        start_date: new Date(),
        end_date: new Date(),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteEducation(id: number) {
    try {
      await supabase.from('education').delete().eq('id', id);
      fetchEducation();
    } catch (error) {
      console.error(error);
    }
  }

  async function submitEducation() {
    if (educations.length < 1) {
      return;
    }

    stepper.next();
  }

  return (
    <form action={submitEducation}>
      <Card>
        <CardHeader>
          <CardTitle>Add Education</CardTitle>
          <CardDescription>Add your previous education.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="institute_name">Institution Name</Label>
          <Input
            id="institute_name"
            name="institute_name"
            placeholder="Institution Name"
            onChange={(e) => {
              setEducation({
                ...education,
                institute_name: e.target.value,
              });
            }}
          />

          <div className="flex flex-col my-2">
            <Label className="mb-1" htmlFor="start_date">
              Start Date
            </Label>
            <DatePicker
              name="start_date"
              value={education.start_date}
              onSelect={(date) => {
                setEducation({
                  ...education,
                  start_date: date,
                });
              }}
            />
          </div>
          <div className="flex flex-col my-2">
            <Label className="mb-1" htmlFor="end_date">
              End Date
            </Label>
            <DatePicker
              name="end_date"
              value={education.end_date}
              onSelect={(date) =>
                setEducation({ ...education, end_date: date })
              }
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button type="button" onClick={addEducation}>
              Add Education
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {education != null &&
            educations?.length > 0 &&
            educations
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

                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => deleteEducation(education.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}

          {educations?.length === 0 && (
            <p className="text-sm opacity-70">No Education added yet</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end py-2">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={stepper.previous}
        >
          Back
        </Button>
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
