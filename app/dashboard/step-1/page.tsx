import { supabaseClientServer } from '@/app/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (userEmail == null) {
    throw new Error('User email not found');
  }

  const { data } = await supabaseClientServer
    .from('job_advertisement')
    .select()
    .eq('user_id', userEmail)
    .limit(1)
    .single();

  const jobAdvertisement = data?.text ?? '';

  async function handleSubmit(formData: FormData) {
    'use server';

    if (session == null) {
      return;
    }

    // // TODO: validate form data
    const rawFormData = {
      jobAdvertisement: formData.get('job-advertisement') as string,
    };

    // // save in database
    // // TODO: reference resume id
    if (data?.id) {
      await supabaseClientServer
        .from('job_advertisement')
        .update({
          text: rawFormData.jobAdvertisement,
        })
        .eq('id', data.id);
    } else {
      await supabaseClientServer.from('job_advertisement').upsert({
        text: rawFormData.jobAdvertisement,
        user_id: session.user?.email,
      });
    }

    redirect('/dashboard/step-2');
  }

  return (
    <main className="py-16">
      <Card>
        <CardHeader>
          <CardTitle>Job Advertisement</CardTitle>
          <CardDescription>
            Copy the Job Advertisement Text in here to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <Textarea
              name="job-advertisement"
              required
              defaultValue={jobAdvertisement}
            />
            <div className="flex justify-end mt-6">
              <Button type="submit">Next</Button>
            </div>
            {/* TODO: adding a link to a job advertisement should extract the text with a web crawler */}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
