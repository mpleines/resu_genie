'use client';

import ModernCreativeResume, {
  MinimalisticResumeTemplate,
  ProfessionalResumeTemplate,
} from '@/app/components/PdfTemplates';
import { Button } from '@/components/ui/button';
import { ResumeResponse } from '@/lib/promptHelper';
import { createClient } from '@/lib/supabase/client';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { Download, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  if (optimizedResume == null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Tabs
      orientation="vertical"
      defaultValue="minimalistic"
      className="w-full flex"
    >
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-muted/30 p-4 hidden md:block">
        <h2 className="font-semibold mb-4">Choose Template</h2>
        <TabsList className="flex flex-col h-auto bg-transparent gap-2">
          <TabsTrigger
            value="minimalistic"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">Minimalistic</div>
              <div className="text-xs text-muted-foreground">
                Clean and simple design
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="professional"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">Professional</div>
              <div className="text-xs text-muted-foreground">
                Traditional business style
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="modern_creative"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">Modern & Creative</div>
              <div className="text-xs text-muted-foreground">
                Stand out from the crowd
              </div>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <h2 className="font-semibold mb-4">Download Resume</h2>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <div className="px-8">
        <TabsContent value="minimalistic" className="mt-0">
          <MinimalisticResumeTemplate
            ref={contentRef}
            data={optimizedResume}
            email={session.data?.user?.email ?? ''}
          />
        </TabsContent>
        <TabsContent value="professional" className="mt-0">
          <ProfessionalResumeTemplate
            ref={contentRef}
            data={optimizedResume}
            email={session?.data?.user?.email ?? ''}
          />
        </TabsContent>
        <TabsContent value="modern_creative" className="mt-0">
          <ModernCreativeResume
            ref={contentRef}
            data={optimizedResume}
            email={session?.data?.user?.email ?? ''}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
