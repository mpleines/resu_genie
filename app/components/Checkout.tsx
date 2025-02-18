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

type CommonProps = {
  resumeId: number;
};

const Checkout: React.FunctionComponent<CommonProps> = ({ resumeId }) => {
  console.log('checkout resume id: ', resumeId);
  return (
    <form action="/api/checkout_sessions" method="POST">
      <input type="hidden" name="resumeId" value={resumeId} />
      <section>
        <Button type="submit" role="link">
          Buy Now for 2,99€
        </Button>
      </section>
    </form>
  );
};

export const CheckoutDialog: React.FunctionComponent<CommonProps> = ({
  resumeId,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Purchase now (2,99€)</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            By purchasing, you will unlock the PDF download for this resume.
            After purchasing, you can still change the layout if you want to.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Checkout resumeId={resumeId} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
