'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertDestructive } from './AlertDestructive';
import { Skeleton } from '@/components/ui/skeleton';
import StepperFooter from './StepperFooter';

type Skill = Database['public']['Tables']['skills']['Row'];

const skillFormSchema = z.object({
  skill: z.string().min(1, { message: 'This field is required' }),
});

export default function SkillsForm() {
  useScrollToTop();

  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const stepper = useStepper();

  const form = useForm<z.infer<typeof skillFormSchema>>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      skill: '',
    },
  });

  const submitForm = useForm({});

  const [skills, setSkills] = useState<Skill[]>([]);

  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const [loadingSkills, setLoadingSkills] = useState(true);

  const fetchSkills = useCallback(async () => {
    if (userEmail == null) {
      return;
    }

    await supabase
      .from('skills')
      .select()
      .eq('user_id', userEmail)
      .eq('resume_id', resumeId)
      .then(({ data }) => {
        if (data != null) {
          setSkills(data);
        }
      });
  }, [userEmail, supabase, resumeId]);

  useEffect(() => {
    fetchSkills().then(() => setLoadingSkills(false));
  }, [userEmail, fetchSkills]);

  async function addSkill(formData: z.infer<typeof skillFormSchema>) {
    const { skill } = formData;

    if (!skill) {
      return;
    }

    const response = await supabase.from('skills').insert({
      skill_name: skill,
      user_id: userEmail,
      resume_id: resumeId,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      submitForm.reset({});
      form.reset({ skill: '' });
    }

    await fetchSkills();
  }

  async function removeSkill(skillId: number) {
    const response = await supabase.from('skills').delete().eq('id', skillId);

    if (response.error) {
      console.error(response.error);
      return;
    }

    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id != skillId)
    );
  }

  async function submitSkills() {
    if (skills.length === 0) {
      submitForm.setError('root', {
        message: 'You need to add at least one skill',
      });
      return;
    }

    await supabase
      .from('resume')
      .update({
        last_updated: new Date().toISOString(),
      })
      .eq('id', resumeId);

    stepper.next();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Enter the Skills you have that are relevant to the job advertisement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addSkill)} className="space-y-4">
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Skill</FormLabel>
                      <div className="flex w-full items-center space-x-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Add a skill"
                            disabled={
                              form.formState.isSubmitting ||
                              submitForm.formState.isSubmitting
                            }
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          disabled={
                            form.formState.isSubmitting ||
                            submitForm.formState.isSubmitting
                          }
                        >
                          Add
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>

          <div className="flex flex-wrap gap-2 mt-4">
            {loadingSkills &&
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="ml-2 w-16 h-6 rounded-lg " />
              ))}
            {!loadingSkills && skills.length === 0 ? (
              <span className="h-6 text-sm">No skills added</span>
            ) : (
              skills?.map((skill) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.skill_name}
                  <button
                    type="button"
                    disabled={
                      form.formState.isSubmitting ||
                      submitForm.formState.isSubmitting
                    }
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 hover:text-destructive focus:text-destructive"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={16} />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Form {...submitForm}>
        <form onSubmit={submitForm.handleSubmit(submitSkills)}>
          {submitForm.formState.errors.root?.message && (
            <AlertDestructive
              className="my-2"
              message={submitForm.formState.errors.root.message}
            />
          )}
          <StepperFooter isSubmitting={submitForm.formState.isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
