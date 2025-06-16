'use client';

import { generateResumeJob } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Summary } from '@/types/types';
import { FileText, Loader2 } from 'lucide-react';
import { Session } from 'next-auth';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SubmitResume(props: {
  resumeId: string;
  data: Summary;
  user: Session['user'];
}) {
  const t = useTranslations('global');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleResumeGeneration() {
    setIsLoading(true);
    const { jobId } = await generateResumeJob(props.resumeId, props.user);
    router.push(`/resume/${props.resumeId}/generating?jobId=${jobId}`);
    setIsLoading(false);
  }

  return (
    <Button onClick={handleResumeGeneration}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-6 w-6 mr-2" />
      )}
      {t('generateResume')}
    </Button>
  );
}
