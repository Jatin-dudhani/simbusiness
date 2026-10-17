import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-Side Checkout & Stripe Route
 * Confines the STRIPE_SECRET_KEY strictly to server execution.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount) || 49.99;
    const currency = body.currency || 'usd';

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (secretKey) {
      try {
        // Authenticate with Stripe API directly via server request
        const res = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            amount: Math.round(amount * 100).toString(),
            currency: currency.toLowerCase(),
            'payment_method_types[]': 'card',
            description: 'SimBusiness Test Order',
          }),
        });

        if (res.ok) {
          const intent = await res.json();
          return NextResponse.json({
            success: true,
            mode: 'stripe_test_gateway',
            paymentIntentId: intent.id,
            status: intent.status,
            clientSecret: intent.client_secret,
          });
        }
      } catch (stripeErr: any) {
        console.warn('Stripe gateway error:', stripeErr?.message);
      }
    }

    // High-fidelity fallback sandbox checkout
    return NextResponse.json({
      success: true,
      mode: 'sandbox_simulation',
      transactionId: `txn_${Date.now().toString().slice(-8)}`,
      status: 'succeeded',
      amount,
      currency,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
