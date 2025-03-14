import BackButton from './BackButton';
import SubmitButton from './SubmitButton';
import { useTranslations } from 'next-intl';

type StepperFooterProps = {
  isSubmitting?: boolean;
  showBackButton?: boolean;
  isDisabled?: boolean;
  formRef?: React.RefObject<HTMLFormElement | null>;
};

const StepperFooter: React.FC<StepperFooterProps> = ({
  isSubmitting,
  showBackButton = true,
  isDisabled,
  formRef,
}) => {
  const t = useTranslations('global');
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="mx-auto max-w-screen-2xl flex justify-end px-0 md:px-4">
        {showBackButton && <BackButton disabled={isSubmitting || isDisabled} />}
        <SubmitButton
          text={t('next')}
          pending={isSubmitting}
          disabled={isDisabled}
          formRef={formRef}
        />
      </div>
    </footer>
  );
};

export default StepperFooter;
