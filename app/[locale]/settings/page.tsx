'use client';

import { LocaleSwitch } from '@/app/components/LocaleSwitch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('settings');

  return (
    <main className="mx-auto max-w-screen-2xl w-full p-4 flex-1 overflow-y-auto">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-col space-y-1">
            <Label className="font-bold text-base">{t('locale.title')}</Label>
            <span className="text-sm text-muted-foreground">
              {t('locale.description')}
            </span>
            <LocaleSwitch isHeader={false} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
