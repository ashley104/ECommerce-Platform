import { NextResponse, NextRequest } from 'next/server';

import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const { items } = await request.json();

  // Create line items for Stripe
  const lineItems = items.map((item: any) => {
    return {
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
      
        unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
      },
    quantity: item.quantity,
  }});

  // Create a Stripe Checkout session
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: lineItems,
    
    mode: "payment",
    
    success_url: `${request.headers.get(
      "origin"
    )}/success`,

    cancel_url: `${request.headers.get(
      "origin"
    )}/cart`,
  });

  return NextResponse.json({
    url: session.url,
  });
}
