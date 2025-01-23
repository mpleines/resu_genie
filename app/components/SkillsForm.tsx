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
import {
  useCallback,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import SubmitButton from './SubmitButton';
import { useStepper } from '../(steps)/useStepper';
import { useParams } from 'next/navigation';
import BackButton from './BackButton';
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
import { toast } from '@/hooks/use-toast';

type Skill = Database['public']['Tables']['skills']['Row'];
type SkillInsert = Database['public']['Tables']['skills']['Insert'];
type OptimisticSkill = SkillInsert & { sending?: boolean };

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

  const [_, startAddSkillTransition] = useTransition();
  const [optimisticSkills, addOptimisticSkill] = useOptimistic<
    OptimisticSkill[],
    OptimisticSkill
  >(skills, (state, newSkill) => [...state, newSkill]);

  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

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
    fetchSkills();
  }, [userEmail, fetchSkills]);

  async function addSkill(formData: z.infer<typeof skillFormSchema>) {
    startAddSkillTransition(async () => {
      const { skill: skill_name } = formData;

      if (!skill_name || !userEmail) {
        return;
      }

      const newSkill: Database['public']['Tables']['skills']['Insert'] = {
        skill_name,
        user_id: userEmail,
        resume_id: resumeId,
      };

      addOptimisticSkill({ ...newSkill, sending: true });
      submitForm.reset({});
      form.reset({ skill: '' });

      const { data, error } = await supabase
        .from('skills')
        .insert(newSkill)
        .select()
        .single();

      if (error || data == null) {
        toast({
          title: 'Error',
          description: 'Something went wrong when adding the skill',
          variant: 'destructive',
        });

        return;
      }

      setSkills((prevSkills) => [...prevSkills, data]);
    });
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
                          <Input {...field} placeholder="Add a skill" />
                        </FormControl>
                        <Button type="submit">Add</Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>

          <div className="flex flex-wrap gap-2 mt-4">
            {optimisticSkills?.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill.skill_name}{' '}
                <button
                  type="button"
                  disabled={skill.sending}
                  onClick={() => (skill.id ? removeSkill(skill.id) : null)}
                  className="ml-2 hover:text-destructive focus:text-destructive"
                  aria-label={`Remove ${skill}`}
                >
                  {!!skill.sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <X size={16} />
                  )}
                </button>
              </Badge>
            ))}
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
          <div className="flex justify-end">
            <BackButton />
            <SubmitButton
              text="Next"
              pending={submitForm.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
