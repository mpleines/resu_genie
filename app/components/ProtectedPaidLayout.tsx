'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStepper } from '../(steps)/useStepper';
import { Database } from '@/types/supabase';

const ProtectedPaidLayout = ({
  children,
  resume,
}: {
  children: React.ReactNode;
  resume?: Database['public']['Tables']['resume']['Row'];
}) => {
  const { currentStep } = useStepper();
  const router = useRouter();
  const isDownloadRoute = currentStep?.path.includes('/download-resume');
  const shouldRedirect = resume?.payment_successful && !isDownloadRoute;

  useEffect(() => {
    if (shouldRedirect) {
      router.push(`/resume/${resume?.id}/download-resume`);
      router.refresh();
    }
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null;
  }

  return children;
};

export default ProtectedPaidLayout;
