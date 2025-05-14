import Stripe from 'stripe';
import { Request, Response } from 'express';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent for a one-time payment
 */
export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const { amount, currency = 'pln', metadata = {} } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Convert to cents/smallest currency unit
    const amountInSmallestUnit = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: error.message,
    });
  }
}

/**
 * Create a new customer in Stripe
 */
export async function createCustomer(req: Request, res: Response) {
  try {
    const { email, name, phone, metadata = {} } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata,
    });

    res.json({
      id: customer.id,
      email: customer.email,
    });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      error: error.message,
    });
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    // For development we can still return success without validating the signature
    // In production, you should make sure to have a webhook secret
    console.warn('STRIPE_WEBHOOK_SECRET not found - skipping signature verification');
    return processWebhookEvent(req.body, res);
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  return processWebhookEvent(event, res);
}

/**
 * Process webhook events
 */
async function processWebhookEvent(event: any, res: Response) {
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Update your database here
      break;
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout session completed: ${session.id}`);
      // Fulfill the purchase
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
}