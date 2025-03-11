'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';

type ResumePreviewProps = {};

export const NewResume: FunctionComponent<ResumePreviewProps> = () => {
  const supabase = createClient();
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const { toast } = useToast();
  const t = useTranslations('newResumeCard');

  const onClick = async () => {
    const { data: resume, error } = await supabase
      .from('resume')
      .insert({
        user_id: userId,
      })
      .select()
      .single();

    if (error || resume == null) {
      toast({
        title: 'Error',
        description: 'Failed to create resume',
        variant: 'destructive',
      });
      return;
    } else {
      router.push(`/resume/${resume?.id}/job-advertisement`);
    }
  };

  return (
    <Card
      className="w-full h-[250px] md:h-[300px] cursor-pointer hover:shadow-lg transition-shadow grid place-items-center"
      onClick={onClick}
    >
      <CardContent className="grid place-items-center">
        <>
          <PlusCircle className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-center mb-1">
            {t('title')}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            {t('description')}
          </p>
        </>
      </CardContent>
    </Card>
  );
};
