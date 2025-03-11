'use client';
import { Button } from '@/components/ui/button';
import { usePathname, Link } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export const LocaleSwitch: React.FunctionComponent = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');
  return (
    <Button
      asChild
      variant="ghost"
      title={t(`switchTo.${locale === 'de' ? 'en' : 'de'}`)}
    >
      <Link href={pathname} locale={locale === 'de' ? 'en' : 'de'}>
        <Globe />
        {locale.toUpperCase()}
      </Link>
    </Button>
  );
};
