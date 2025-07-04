'use client';

import { Button } from '@/components/ui/button';
import { ResumeResponse } from '@/lib/promptHelper';
import { createClient } from '@/lib/supabase/client';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { Download, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useSearchParams } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MinimalisticResumeTemplate,
  ProfessionalResumeTemplate,
} from '@/app/components/PdfTemplates';
import { PDFViewer } from '@react-pdf/renderer';
import { useIsSmallScreen } from '@/hooks/useIsSmallScreen';
import { CheckoutDialog } from '@/app/components/Checkout';
import { Database } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { pdf } from '@react-pdf/renderer';
import MobilePdfPreview from '@/app/components/MobilePdfPreview';

const handlePdfDownload = async (
  pdfTemplate: ReactElement<any>,
  fileName: string
) => {
  try {
    const blob = await pdf(pdfTemplate).toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;

    // Append to body to ensure it works on mobile
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error in download process:', error);
  }
};

export default function Page() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const supabase = createClient();
  const t = useTranslations('downloadResume');

  const [resume, setResume] =
    useState<Database['public']['Tables']['resume']['Row']>();
  const [optimizedResume, setOptimizedResume] = useState<ResumeResponse>();

  const [selectedDocument, setSelectedDocument] = useState<
    'minimalistic' | 'professional'
  >('minimalistic');

  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  const searchParams = useSearchParams();
  const jobId = searchParams?.get('jobId') ?? null;

  const isSmallScreen = useIsSmallScreen();

  useScrollToTop();

  const getOptimizedResumeData = useCallback(async () => {
    if (!userId) {
      return;
    }
    const { data, error } = await supabase
      .from('resume')
      .select()
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: t('errorLoadingResume'),
        className: 'bg-error',
      });
    }

    if (data?.chat_gpt_response_raw == null) {
      return;
    }

    const resumeData = data?.chat_gpt_response_raw as ResumeResponse;
    setOptimizedResume(resumeData);
  }, [resumeId, supabase, userId]);

  const getResume = useCallback(async () => {
    if (!userId) {
      return;
    }

    const { data: resume, error } = await supabase
      .from('resume')
      .select()
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: t('errorLoadingResume'),
        className: 'bg-error',
      });
    }

    setResume(resume!);
  }, [resumeId, supabase, userId]);

  const downloadPdf = async () => {
    const filename = `resume-${session?.data?.user?.name}-${Date.now()}}`;

    if (selectedDocument === 'minimalistic') {
      const doc = (
        <MinimalisticResumeTemplate
          data={optimizedResume}
          email={session.data?.user?.email ?? ''}
        />
      );
      handlePdfDownload(doc, filename);
    }

    if (selectedDocument === 'professional') {
      const doc = (
        <ProfessionalResumeTemplate
          data={optimizedResume}
          email={session?.data?.user?.email ?? ''}
        />
      );

      handlePdfDownload(doc, filename);
    }
  };

  useEffect(() => {
    getResume();
    getOptimizedResumeData();
  }, [getOptimizedResumeData]);

  const { toast } = useToast();
  useEffect(() => {
    if (!resume?.payment_successful) {
      return;
    }

    const paymentSuccessId = `payment-successful-${resume?.id}`;

    if (localStorage.getItem(paymentSuccessId) == null) {
      toast({
        title: t('paymentSuccessful.title'),
        description: t('paymentSuccessful.description'),
        className: 'bg-success',
      });

      localStorage.setItem(paymentSuccessId, 'true');
    }
  }, [resume?.payment_successful]);

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
          <TabsTrigger
            value="minimalistic"
            className="w-full"
            onClick={() => setSelectedDocument('minimalistic')}
          >
            Minimalistic
          </TabsTrigger>
          <TabsTrigger
            value="professional"
            className="w-full"
            onClick={() => setSelectedDocument('professional')}
          >
            Professional
          </TabsTrigger>
          <TabsTrigger disabled value="modern_creative" className="w-full">
            Modern & Creative
          </TabsTrigger>
        </TabsList>
        {resume?.payment_successful ? (
          <Button onClick={downloadPdf} className="w-full mt-2">
            <Download />
            <div>{t('download')}</div>
          </Button>
        ) : (
          <CheckoutDialog resumeId={resumeId} />
        )}
        <TabsContent value="minimalistic" className="w-full mt-2">
          <MobilePdfPreview
            document={
              <MinimalisticResumeTemplate
                data={optimizedResume}
                email={session.data?.user?.email ?? ''}
              />
            }
          />
        </TabsContent>
        <TabsContent value="professional" className="mt-0">
          <MobilePdfPreview
            document={
              <ProfessionalResumeTemplate
                data={optimizedResume}
                email={session?.data?.user?.email ?? ''}
              />
            }
          />
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
        <h2 className="font-semibold mb-4">{t('chooseTemplate')}</h2>
        <TabsList className="flex flex-col h-auto bg-transparent gap-2">
          <TabsTrigger
            onClick={() => setSelectedDocument('minimalistic')}
            value="minimalistic"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">
                {t('templates.minimalistic.title')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('templates.minimalistic.description')}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setSelectedDocument('professional')}
            value="professional"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">
                {t('templates.professional.title')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('templates.professional.description')}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            disabled
            value="modern_creative"
            className="w-full justify-start px-4 py-6 data-[state=active]:bg-background"
          >
            <div className="text-left">
              <div className="font-medium">
                {t('templates.modernCreative.title')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('templates.modernCreative.description')}
              </div>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <h2 className="font-semibold mb-4">{t('download')}</h2>

          {resume?.payment_successful ? (
            <Button onClick={downloadPdf}>
              <Download />
              <div>{t('download')}</div>
            </Button>
          ) : (
            <CheckoutDialog resumeId={resumeId} />
          )}
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
