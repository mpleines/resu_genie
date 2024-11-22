'use client';

import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';

type ResumePreviewProps = {};

export const NewResume: FunctionComponent<ResumePreviewProps> = () => {
  const supabase = createClient();
  const router = useRouter();
  const session = useSession();
  const userEmail = session?.data?.user?.email;

  const onClick = async () => {
    const { data: resume, error } = await supabase
      .from('resume')
      .insert({
        user_id: userEmail,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    router.push(`/resume/${resume?.id}/job-advertisement`);
  };

  return (
    <Card
      className="w-[250px] h-[300px] cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="w-[250px] h-[300px] cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center">
        <>
          <PlusCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-center mb-1">
            Create New Resume
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Click to get started
          </p>
        </>
      </CardContent>
    </Card>
  );
};
