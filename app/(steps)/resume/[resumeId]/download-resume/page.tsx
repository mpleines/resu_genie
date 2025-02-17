'use client';

import { Button } from '@/components/ui/button';
import { ResumeResponse } from '@/lib/promptHelper';
import { createClient } from '@/lib/supabase/client';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MinimalisticResumeTemplate,
  ProfessionalResumeTemplate,
} from '@/app/components/PdfTemplates';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useIsSmallScreen } from '@/hooks/useIsSmallScreen';

export default function Page() {
  const session = useSession();
  const supabase = createClient();
  const [optimizedResume, setOptimizedResume] = useState<ResumeResponse>();

  const [selectedDocument, setSelectedDocument] = useState<
    'minimalistic' | 'professional'
  >('minimalistic');

  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const isSmallScreen = useIsSmallScreen();

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

  if (isSmallScreen) {
    return (
      <Tabs orientation="horizontal" defaultValue="minimalistic">
        <TabsList className="mt-2 flex flex-row justify-between">
          <TabsTrigger value="minimalistic" className="w-full">
            Minimalistic
          </TabsTrigger>
          <TabsTrigger value="professional" className="w-full">
            Professional
          </TabsTrigger>
          <TabsTrigger disabled value="modern_creative" className="w-full">
            Modern & Creative
          </TabsTrigger>
        </TabsList>
        <PDFDownloadLink
          className="w-full mt-2"
          document={
            selectedDocument === 'minimalistic' ? (
              <MinimalisticResumeTemplate
                data={optimizedResume}
                email={session.data?.user?.email ?? ''}
              />
            ) : (
              <ProfessionalResumeTemplate
                data={optimizedResume}
                email={session?.data?.user?.email ?? ''}
              />
            )
          }
          fileName={`${session?.data?.user?.name ?? ''}-resume.pdf`}
        >
          {({ loading }) =>
            loading ? (
              'Preparing document...'
            ) : (
              <Button className="w-full h-full mt-2">Download PDF</Button>
            )
          }
        </PDFDownloadLink>
        <TabsContent value="minimalistic" className="w-full mt-2">
          <PDFViewer width="100%" height="500px" showToolbar={false}>
            <MinimalisticResumeTemplate
              data={optimizedResume}
              email={session.data?.user?.email ?? ''}
            />
          </PDFViewer>
        </TabsContent>
        <TabsContent value="professional" className="mt-0">
          <PDFViewer width="100%" height="500px" showToolbar={false}>
            <ProfessionalResumeTemplate
              data={optimizedResume}
              email={session?.data?.user?.email ?? ''}
            />
          </PDFViewer>
        </TabsContent>
        <TabsContent value="modern_creative" className="mt-0"></TabsContent>
      </Tabs>
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
            onClick={() => setSelectedDocument('minimalistic')}
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
            onClick={() => setSelectedDocument('professional')}
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
            disabled
            value="modern_creative"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">Modern & Creative</div>
              <div className="text-xs text-muted-foreground">coming soon</div>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <h2 className="font-semibold mb-4">Download Resume</h2>

          <PDFDownloadLink
            document={
              selectedDocument === 'minimalistic' ? (
                <MinimalisticResumeTemplate
                  data={optimizedResume}
                  email={session.data?.user?.email ?? ''}
                />
              ) : (
                <ProfessionalResumeTemplate
                  data={optimizedResume}
                  email={session?.data?.user?.email ?? ''}
                />
              )
            }
            fileName={`${session?.data?.user?.name ?? ''}-resume.pdf`}
          >
            {({ loading }) =>
              loading ? (
                'Preparing document...'
              ) : (
                <Button className="w-full">Download PDF</Button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
      <div className="px-8">
        <TabsContent value="minimalistic" className="mt-0">
          <PDFViewer width="500px" height="600px" showToolbar={false}>
            <MinimalisticResumeTemplate
              data={optimizedResume}
              email={session.data?.user?.email ?? ''}
            />
          </PDFViewer>
        </TabsContent>
        <TabsContent value="professional" className="mt-0">
          <PDFViewer width="500px" height="600px" showToolbar={false}>
            <ProfessionalResumeTemplate
              data={optimizedResume}
              email={session?.data?.user?.email ?? ''}
            />
          </PDFViewer>
        </TabsContent>
        <TabsContent value="modern_creative" className="mt-0">
          <PDFViewer width="500x" height="500px"></PDFViewer>
        </TabsContent>
      </div>
    </Tabs>
  );
}
