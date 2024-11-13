import EducationForm from '@/app/components/EducationForm';
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
import { Database } from '@/types/supabase';
import { Trash } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  if (userEmail == null) {
    throw new Error('User email not found');
  }

  const { data: education } = await supabaseClientServer
    .from('education')
    .select()
    .eq('user_id', userEmail);

  async function addEducation(formData: FormData) {
    'use server';

    const education: Database['public']['Tables']['education']['Insert'] = {
      user_id: userEmail,
      institute_name: formData.get('institute_name') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
    };

    await supabaseClientServer.from('education').insert(education);

    revalidatePath('/');
  }

  async function next() {
    'use server';
    redirect('/dashboard/step-6');
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  async function deleteEducation(formDate: FormData) {
    'use server';
    const id = formDate.get('id') as string;
    await supabaseClientServer.from('education').delete().eq('id', id);
    revalidatePath('/');
  }

  return (
    <main className="py-16">
      <Card>
        <CardHeader>
          <CardTitle>Add Education</CardTitle>
          <CardDescription>Add your previous education.</CardDescription>
        </CardHeader>
        <CardContent>
          <EducationForm addEducation={addEducation} />
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {education != null &&
            education?.length > 0 &&
            education
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
                        {formatDate(education.start_date!)} -{' '}
                        {formatDate(education.end_date!)}
                      </p>
                    </div>

                    <form action={deleteEducation}>
                      <input type="hidden" name="id" value={education.id} />
                      <Button variant="destructive" type="submit">
                        <Trash />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}

          {education?.length === 0 && (
            <p className="text-sm opacity-70">No Education added yet</p>
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
