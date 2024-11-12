import { DatePicker } from '@/app/components/DatePicker';
import WorkExperienceForm from '@/app/components/WorkExperienceForm';
import { supabaseClientServer } from '@/app/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/types/supabase';
import { Trash } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createRef } from 'react';

export default async function Home() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  if (userEmail == null) {
    throw new Error('User email not found');
  }

  const { data: workExperiences } = await supabaseClientServer
    .from('work_experience')
    .select()
    .eq('user_id', userEmail);

  async function addExperience(formData: FormData) {
    'use server';
    // validate the form data and save into variables

    const workExperience: Database['public']['Tables']['work_experience']['Insert'] =
      {
        organisation_name: formData.get('company') as string,
        profile: formData.get('profile') as string,
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string,
        user_id: userEmail,
      };

    await supabaseClientServer.from('work_experience').insert(workExperience);

    revalidatePath('/');
  }

  async function next() {
    'use server';
    redirect('/dashboard/step-5');
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  async function deleteWorkExperience(formDate: FormData) {
    'use server';
    const id = formDate.get('id') as string;
    await supabaseClientServer.from('work_experience').delete().eq('id', id);
    revalidatePath('/');
  }

  return (
    <main className="py-16">
      <Card>
        <CardHeader>
          <CardTitle>Add Work Experience</CardTitle>
          <CardDescription>Add your previous work experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkExperienceForm addExperience={addExperience} />
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
                        {formatDate(workExperience.start_date!)} -{' '}
                        {formatDate(workExperience.end_date!)}
                      </p>
                    </div>

                    <form action={deleteWorkExperience}>
                      <input
                        type="hidden"
                        name="id"
                        value={workExperience.id}
                      />
                      <Button variant="destructive" type="submit">
                        <Trash />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}

          {workExperiences?.length === 0 && (
            <p className="text-sm opacity-70">No work experience added yet</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <form action={next}>
            <Button type="submit">Next</Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
