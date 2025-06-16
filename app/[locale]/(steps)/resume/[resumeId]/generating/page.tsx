'use client';

import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const supabase = createClient();
  const { resumeId } = useParams();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const router = useRouter();
  const [jobFailed, setJobFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!jobId) return;

    // Check status immediately
    const checkStatus = async () => {
      const { data } = await supabase
        .from('resume_job')
        .select('status')
        .eq('id', jobId)
        .single();

      if (data?.status === 'done') {
        router.push(`/resume/${resumeId}/download-resume/`);
      }

      if (data?.status === 'failed') {
        setJobFailed(true);
      }
    };

    checkStatus();

    // Subscribe to updates
    const channel = supabase
      .channel('resume_job')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resume_job',
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          if (payload.new.status === 'done') {
            router.push(`/resume/${resumeId}/download-resume/`);
          }

          if (payload.new.status === 'failed') {
            setJobFailed(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, supabase, router, resumeId]);

  // TODO: add re-generate button
  if (jobFailed) {
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      Error generating Resume.
    </div>;
  }

  // TODO: improve page content
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Loader2 className="animate-spin" />
      <div style={{ fontSize: 20, fontWeight: 500 }}>
        Your PDF is being generated...
      </div>
      <div style={{ marginTop: 8, fontSize: 14 }}>
        This may take a few moments. Please wait.
      </div>
    </div>
  );
}
