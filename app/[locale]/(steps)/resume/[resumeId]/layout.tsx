import { ReactNode } from 'react';
import { StepperProvider, Steps } from '../../../../../hooks/useStepper';
import supabaseClient from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProtectedPaidLayout from '@/app/components/ProtectedPaidLayout';
import { auth } from '@/auth';
import Stepper from '@/app/components/Stepper';
import { getTranslations } from 'next-intl/server';

const getResumeSteps = async (resumeId: string): Promise<Steps> => {
  const t = await getTranslations();

  return [
    {
      label: t('jobAdvertisement.title'),
      path: `/resume/${resumeId}/job-advertisement`,
      description: t('jobAdvertisement.description'),
    },
    {
      label: t('personalInformation.title'),
      path: `/resume/${resumeId}/personal-information`,
      description: t('personalInformation.description'),
    },
    {
      label: t('skills.title'),
      path: `/resume/${resumeId}/skills`,
      description: t('skills.description'),
    },
    {
      label: t('workExperience.title'),
      path: `/resume/${resumeId}/work-experience`,
      description: t('workExperience.description'),
    },
    {
      label: t('education.title'),
      path: `/resume/${resumeId}/education`,
      description: t('education.description'),
    },
    {
      label: t('summary.title'),
      path: `/resume/${resumeId}/summary`,
      description: t('summary.description'),
    },
    {
      label: t('downloadResume.title'),
      path: `/resume/${resumeId}/download-resume`,
      description: t('downloadResume.description'),
    },
  ];
};

export default async function DashboardLayout(props: {
  children: ReactNode;
  params: Promise<any>;
}) {
  const params = await props.params;

  const { children } = props;

  const supabase = supabaseClient();
  const session = await auth();

  const { data: resume, error } = await supabase
    .from('resume')
    .select()
    .eq('id', params.resumeId)
    .eq('user_id', session?.user?.id)
    .single();

  if (resume == null || error) {
    notFound();
  }

  const steps = await getResumeSteps(params.resumeId);

  return (
    <div className="min-h-screen flex flex-col">
      <StepperProvider steps={steps}>
        <main className="mx-auto max-w-screen-2xl w-full p-4 flex-1 overflow-y-auto">
          <div>
            <Stepper disableAllButLast={!!resume.payment_successful} />
          </div>
          <div className="mt-4 pb-16">
            <ProtectedPaidLayout resume={resume}>
              {children}
            </ProtectedPaidLayout>
          </div>
        </main>
      </StepperProvider>
    </div>
  );
}
