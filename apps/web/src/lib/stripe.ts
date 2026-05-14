import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_API_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_API_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    });
  }
  return stripeInstance;
}