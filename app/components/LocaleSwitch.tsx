'use client';

import { useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
  isHeader?: boolean;
};

export function LocaleSwitch({ isHeader = true }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations('locales');

  function onLocalChange(locale: string) {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale }
    );
  }

  const getLocaleIconCode = (locale: string) => {
    if (locale === 'en') {
      return 'fi-gb';
    }

    return `fi-${locale}`;
  };

  if (isHeader) {
    return (
      <div>
        <Select defaultValue={locale} onValueChange={onLocalChange}>
          <SelectTrigger className="space-x-2 border-none bg-transparent">
            <span className={cn('fi', getLocaleIconCode(locale))}></span>
          </SelectTrigger>
          <SelectContent>
            {routing.locales.map((loc) => (
              <SelectItem key={loc} value={loc}>
                <span className={cn('fi', getLocaleIconCode(loc))}></span>
                <span className="ml-1">{t(loc)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="max-w-[300px]">
      <Select defaultValue={locale} onValueChange={onLocalChange}>
        <SelectTrigger>
          <div className="space-x-2">
            <span className={cn('fi', getLocaleIconCode(locale))}></span>
            <span>{t(locale)}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {routing.locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              <span className={cn('fi', getLocaleIconCode(loc))}></span>
              <span className="ml-1">{t(loc)}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
