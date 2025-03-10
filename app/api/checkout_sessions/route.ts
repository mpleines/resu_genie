import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const resumeId = formData.get('resumeId') as string;
  const stripePriceId =
    process.env.STRIPE_TEST_MODE_ENABLED === 'TRUE'
      ? process.env.STRIPE_PRICE_ID_TEST
      : process.env.STRIPE_PRICE_ID;

  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/resume/${resumeId}/download-resume`,
      cancel_url: `${origin}/resume/${resumeId}/order-cancelled`,
      automatic_tax: { enabled: true },
      metadata: {
        resumeId,
      },
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
