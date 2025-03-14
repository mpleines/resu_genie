'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';

type CommonProps = {
  resumeId: number;
};

const Checkout: React.FunctionComponent<CommonProps> = ({ resumeId }) => {
  const t = useTranslations('downloadResume');
  return (
    <form action="/api/checkout_sessions" method="POST">
      <input type="hidden" name="resumeId" value={resumeId} />
      <section>
        <Button type="submit" role="link">
          {t('purchaseNow')}
        </Button>
      </section>
    </form>
  );
};

export const CheckoutDialog: React.FunctionComponent<CommonProps> = ({
  resumeId,
}) => {
  const t = useTranslations('downloadResume');

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{t('purchaseNow')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('checkout.title')}</DialogTitle>
          <DialogDescription>{t('checkout.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Checkout resumeId={resumeId} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
