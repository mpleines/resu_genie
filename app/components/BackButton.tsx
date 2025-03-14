'use client';

import { Button } from '@/components/ui/button';
import { FunctionComponent } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useStepper } from '../../hooks/useStepper';
import { useTranslations } from 'next-intl';

type Props = {
  disabled?: boolean;
};

const BackButton: FunctionComponent<Props> = ({ disabled }) => {
  const stepper = useStepper();
  const t = useTranslations('global');

  return (
    <Button
      type="button"
      variant="outline"
      className="mr-2 w-24"
      onClick={stepper.previous}
      disabled={disabled}
    >
      <ChevronLeft />
      {t('previous')}
    </Button>
  );
};

export default BackButton;
