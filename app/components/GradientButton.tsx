import { Button, ButtonProps } from '@/components/ui/button';
import { FunctionComponent } from 'react';

const GradientButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <div className="relative group">
      <div className="absolute z-[-1] inset-0 blur-md bg-gradient-to-r from-ice-blue to-lavender-pink transition-all group-hover:scale-110 group-active:scale-95"></div>
      <Button
        {...props}
        className="bg-transparent hover:bg-transparent font-semibold text-black group-hover:ring-4 group-hover:ring-white/50"
      ></Button>
    </div>
  );
};

export default GradientButton;
