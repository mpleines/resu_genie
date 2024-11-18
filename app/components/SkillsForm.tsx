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
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SubmitButton from './SubmitButton';
import Link from 'next/link';

type Skill = Database['public']['Tables']['skills']['Row'];

export default function SkillsForm() {
  const supabase = createClient();
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const router = useRouter();

  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchSkills = useCallback(async () => {
    if (userEmail == null) {
      return;
    }

    await supabase
      .from('skills')
      .select()
      .eq('user_id', userEmail)
      .then(({ data }) => {
        if (data != null) {
          setSkills(data);
        }
      });
  }, [userEmail]);

  useEffect(() => {
    fetchSkills();
  }, [userEmail, fetchSkills]);

  async function addSkill() {
    if (!skill) {
      return;
    }

    const response = await supabase.from('skills').insert({
      skill_name: skill,
      user_id: userEmail,
      resume_id: 1, // TODO: get resume id
    });

    if (response.error) {
      console.error(response.error);
    } else {
      setSkill('');
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
    if (skills.length < 1) {
      return;
    }

    // TODO: write skills to db only when form is submitted

    router.push('/work-experience');
  }

  return (
    <form action={submitSkills}>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Enter the Skills you have that are relevant to the job advertisement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="skill">Skill</Label>
              <Input
                required={skills.length < 1}
                name="skill"
                id="skill"
                placeholder="Skill"
                value={skill}
                onChange={(e) =>
                  e.target.value ? setSkill(e.target.value) : null
                }
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (skill) {
                      addSkill();
                    }
                  }
                }}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button type="button" onClick={addSkill}>
                Add Skill
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {skills?.map((skill) => (
              <Badge key={skill.id} variant="secondary">
                {skill.skill_name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="ml-2 hover:text-destructive focus:text-destructive"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={16} />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end py-2">
        <Link href="/personal-information">
          <Button variant="outline" className="mr-2">
            Back
          </Button>
        </Link>
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
