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
  const userId = session?.data?.user?.id;

  const onClick = async () => {
    const { data: resume, error } = await supabase
      .from('resume')
      .insert({
        user_id: userId,
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
      className="w-full md:w-[250px] h-[250px] md:h-[300px] cursor-pointer hover:shadow-lg transition-shadow grid place-items-center"
      onClick={onClick}
    >
      <CardContent className="grid place-items-center">
        <>
          <PlusCircle className="w-12 h-12 text-primary mb-4" />
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
