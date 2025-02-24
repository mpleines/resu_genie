'use client';

import { generateResume } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Summary } from '@/types/types';
import { FileText, Loader2 } from 'lucide-react';
import { Session } from 'next-auth';
import { useState } from 'react';

export function SubmitResume(props: {
  resumeId: string;
  data: Summary;
  user: Session['user'];
}) {
  const [isLoading, setIsLoading] = useState(false);
  async function handleResumeGeneration() {
    setIsLoading(true);
    await generateResume(props.resumeId, props.data, props.user);
    setIsLoading(false);
  }

  return (
    <Button onClick={handleResumeGeneration}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-6 w-6 mr-2" />
      )}
      Generate Resume
    </Button>
  );
}
