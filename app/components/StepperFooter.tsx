import BackButton from './BackButton';
import SubmitButton from './SubmitButton';

type StepperFooterProps = {
  isSubmitting?: boolean;
  showBackButton?: boolean;
  isDisabled?: boolean;
};

const StepperFooter: React.FC<StepperFooterProps> = ({
  isSubmitting,
  showBackButton = true,
  isDisabled,
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="mx-auto max-w-screen-2xl flex justify-end px-0 md:px-4">
        {showBackButton && <BackButton disabled={isSubmitting || isDisabled} />}
        <SubmitButton
          text="Next"
          pending={isSubmitting}
          disabled={isDisabled}
        />
      </div>
    </footer>
  );
};

export default StepperFooter;
