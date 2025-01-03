'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import BackButton from './BackButton';
import { useScrollToTop } from '@/lib/useScrollToTop';

export default function PersonalInformationForm() {
  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const stepper = useStepper();
  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

  const [personalInfo, setPersonalInfo] = useState<
    Database['public']['Tables']['personal_information']['Row'] | null
  >();

  useEffect(() => {
    async function fetchPersonalInfo() {
      if (userEmail == null) {
        return;
      }

      const { data } = await supabase
        .from('personal_information')
        .select()
        .eq('user_id', userEmail)
        .eq('resume_id', resumeId)
        .limit(1)
        .single();

      setPersonalInfo(data);
    }

    fetchPersonalInfo();
  }, [userEmail, resumeId, supabase]);

  async function submitPersonalInfo(formData: FormData) {
    const personalInformation = {
      name: formData.get('name') as string,
      phone_1: formData.get('phone') as string,
      address: formData.get('street') as string,
      city: formData.get('city') as string,
      professional_experience_in_years: Number(
        formData.get('professional-experience')
      ),
      user_id: userEmail,
      resume_id: resumeId,
    };

    try {
      await supabase.from('personal_information').upsert(personalInformation, {
        onConflict: 'resume_id',
      });
      await supabase
        .from('resume')
        .update({
          last_updated: new Date().toISOString(),
        })
        .eq('id', resumeId);
      stepper.next();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form action={submitPersonalInfo}>
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Enter you Contact Information to start
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your Name"
            required
            defaultValue={personalInfo?.name ?? ''}
          />
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Your Phone Number"
            defaultValue={personalInfo?.phone_1 ?? ''}
          />
          {/* <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Your Email" defaultValue={personalInformation?.email ?? ''}/> */}
          <Label htmlFor="street">Street</Label>
          <Input
            id="street"
            name="street"
            placeholder="Your Street"
            defaultValue={personalInfo?.address ?? ''}
          />
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="Your City"
            defaultValue={personalInfo?.city ?? ''}
          />
          <Label htmlFor="professional-experience">
            Professional Experience in Years
          </Label>
          <Input
            name="professional-experience"
            id="professional-experience"
            placeholder="Your Professional Experience in Years"
            defaultValue={personalInfo?.professional_experience_in_years ?? ''}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end py-2">
        <BackButton />
        <SubmitButton text="Next" />
      </div>
    </form>
  );
}
