'use client';

import { MinimalisticResumeTemplate } from '@/app/components/PdfTemplates';
import { Button } from '@/components/ui/button';
import { ResumeResponse } from '@/lib/promptHelper';
import { createClient } from '@/lib/supabase/client';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { DownloadIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function Page() {
  const session = useSession();
  const supabase = createClient();
  const [optimizedResume, setOptimizedResume] = useState<ResumeResponse>();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

  const getOptimizedResumeData = useCallback(async () => {
    const { data } = await supabase
      .from('resume')
      .select()
      .eq('id', resumeId)
      .single();

    if (data?.chat_gpt_response_raw == null) {
      return;
    }

    // FIXME: handle possible errors
    const resumeData = data?.chat_gpt_response_raw as ResumeResponse;
    setOptimizedResume(resumeData);
  }, [resumeId, supabase]);

  async function handleDownload() {
    reactToPrintFn();
  }

  useEffect(() => {
    getOptimizedResumeData();
  }, [getOptimizedResumeData]);

  const { personal_information } = optimizedResume ?? {};

  const contactInfo = [
    personal_information?.address,
    personal_information?.phone_1,
    session.data?.user?.email,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <div className="flex flex-col items-center">
      <div>
        <Button onClick={handleDownload}>
          <DownloadIcon />
          Download
        </Button>
      </div>
      <div className="mt-4 w-full">
        <div className="bg-white shadow-md rounded-md w-full h-auto md:w-[210mm] md:h-[297mm] mx-auto border border-gray-300">
          {optimizedResume && (
            <MinimalisticResumeTemplate
              ref={contentRef}
              contactInfo={contactInfo}
              data={optimizedResume}
            />
          )}
        </div>
      </div>
    </div>
  );
}
