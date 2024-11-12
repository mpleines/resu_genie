'use client';
import { Badge } from '@/components/ui/badge';
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
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Skill = Database['public']['Tables']['skills']['Row'];

const supabaseClient = createClient();

export default function Home() {
  const session = useSession();
  const userEmail = session?.data?.user?.email;

  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchSkills = useCallback(async () => {
    if (userEmail == null) {
      return;
    }

    await supabaseClient
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
    if (skill === '') {
      return;
    }

    const response = await supabaseClient.from('skills').insert({
      skill_name: skill,
      user_id: userEmail,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      setSkill('');
    }

    await fetchSkills();
  }

  async function removeSkill(skillId: number) {
    const response = await supabaseClient
      .from('skills')
      .delete()
      .eq('id', skillId);

    if (response.error) {
      console.error(response.error);
      return;
    }

    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id != skillId)
    );
  }

  return (
    <main className="py-16">
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
                name="skill"
                id="skill"
                placeholder="Skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSkill();
                  }
                }}
              />
            </div>
            {/* TODO: Add multiple skills */}
            <div className="flex justify-end mt-6">
              <Button onClick={addSkill}>Add Skill</Button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {skills?.map((skill) => (
              <Badge key={skill.id} variant="secondary">
                {skill.skill_name}{' '}
                <button
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
        <CardFooter className="flex justify-end">
          <Button onClick={next}>Next</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
