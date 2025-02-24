import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import supabaseClient from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing Stripe webhook secret' },
      { status: 400 }
    );
  }

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  try {
    // Verify Stripe webhook signature
    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      console.log('✅ Stripe Checkout Session Completed:', event);
      const session = event.data.object;
      const resumeId = session.metadata?.resumeId;

      if (!resumeId) {
        console.error('❌ Resume ID missing in metadata.');
        return NextResponse.json(
          { error: 'Resume ID missing' },
          { status: 400 }
        );
      }

      const supabase = supabaseClient();
      // update the resume and set payment_successful to true
      const supabaseResponse = await supabase
        .from('resume')
        .update({ payment_successful: true })
        .eq('id', resumeId);

      if (supabaseResponse.error) {
        console.error(
          '❌ Error updating resume.payment_successful',
          supabaseResponse.error
        );
        return NextResponse.json(
          { error: 'Error updating resume.payment_successful' },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 400 }
    );
  }
}
