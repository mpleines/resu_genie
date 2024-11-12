import { supabaseClientServer } from '@/app/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from '@/types/supabase';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  if (userEmail == null) {
    throw new Error('User email not found');
  }

  const { data: personalInformation } = await supabaseClientServer
    .from('personal_information')
    .select()
    .eq('user_id', userEmail)
    .limit(1)
    .single();

  async function handleSubmit(formData: FormData) {
    'use server';

    if (userEmail == null) {
      return;
    }

    const contactInformation: Database['public']['Tables']['personal_information']['Insert'] =
      {
        name: formData.get('name') as string,
        phone_1: formData.get('phone') as string,
        // email: formData.get('email') as string,
        address: formData.get('street') as string,
        city: formData.get('city') as string,
        professional_experience_in_years: Number(
          formData.get('professional-experience')
        ),
        user_id: userEmail,
      };

    if (personalInformation?.id != null) {
      await supabaseClientServer
        .from('personal_information')
        .update(contactInformation)
        .eq('id', personalInformation?.id);
    } else {
      await supabaseClientServer
        .from('personal_information')
        .insert(contactInformation);
    }

    // for now, just redirect to the next step
    redirect('/dashboard/step-3');
  }

  return (
    <main className="py-16">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Enter you Contact Information to start
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your Name"
              required
              defaultValue={personalInformation?.name ?? ''}
            />
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Your Phone Number"
              defaultValue={personalInformation?.phone_1 ?? ''}
            />
            {/* <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Your Email" defaultValue={personalInformation?.email ?? ''}/> */}
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="street"
              placeholder="Your Street"
              defaultValue={personalInformation?.address ?? ''}
            />
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Your City"
              defaultValue={personalInformation?.city ?? ''}
            />
            <Label htmlFor="professional-experience">
              Professional Experience in Years
            </Label>
            <Input
              name="professional-experience"
              id="professional-experience"
              placeholder="Your Professional Experience in Years"
              defaultValue={
                personalInformation?.professional_experience_in_years ?? ''
              }
            />
            <div className="flex justify-end mt-6">
              <Button type="submit">Next</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
