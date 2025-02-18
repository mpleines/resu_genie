import 'server-only';

import Stripe from 'stripe';

const getStripe = () => {
  if (process.env.STRIPE_TEST_MODE_ENABLED == '1') {
    return new Stripe(process.env.STRIPE_SECRET_KEY_TEST!);
  } else {
    return new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
};

export const stripe = getStripe();
