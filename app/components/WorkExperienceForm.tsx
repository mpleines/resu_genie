'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/app/components/DatePicker';

type Props = {
  addExperience: (formData: FormData) => Promise<void>;
};

export default function WorkExperienceForm({ addExperience }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    if (formRef.current == null) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(formRef.current);

    await addExperience(formData);

    formRef.current.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Label htmlFor="company">Company</Label>
      <Input id="company" name="company" placeholder="Company Name" required />
      <Label htmlFor="profile">Profile/Description</Label>
      <Input id="profile" name="profile" placeholder="profile" required />
      <div className="flex flex-col my-2">
        <Label className="mb-1" htmlFor="start_date">
          Start Date
        </Label>
        <DatePicker name="start_date" />
      </div>
      <div className="flex flex-col my-2">
        <Label className="mb-1" htmlFor="end_date">
          End Date
        </Label>
        <DatePicker name="end_date" />
      </div>
      <div className="flex justify-end mt-6">
        <Button type="submit">Add Work Experience</Button>
      </div>
    </form>
  );
}
