import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FunctionComponent } from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text?: string;
}

const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  text = 'Submit',
}) => {
  const formStatus = useFormStatus();

  return (
    <Button type="submit">
      {formStatus.pending ? (
        <>
          <Loader2 className="animate-spin" /> <span>{text}</span>
        </>
      ) : (
        text
      )}
    </Button>
  );
};

export default SubmitButton;
