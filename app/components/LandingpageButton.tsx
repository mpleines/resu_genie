'use client';
import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, SparklesIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { FunctionComponent } from 'react';

const LandingpageButton: FunctionComponent<ButtonProps> = (props) => {
  const t = useTranslations('landing');

  return (
    <button
      onClick={() => signIn()}
      {...props}
      className={cn(
        'text-white group relative inline-flex items-center justify-center gap-2 px-12 py-4 rounded-md bg-primary transition-all duration-300 hover:animate-[gradientMove_2s_linear_infinite]',
        props.className
      )}
    >
      <SparklesIcon />
      <span className="text-md font-semibold">{t('createResume')}</span>
      <ArrowRight className=" ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
    </button>
  );
};

export default LandingpageButton;
