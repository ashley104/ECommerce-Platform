import { NextResponse } from 'next/server';

import { stripe } from "@/functions/stripe";
import { client } from "@repo/db/client";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: items are required" },
        { status: 400 }
      );
    }

    const parsedItems = items
      .map((item: unknown) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const candidate = item as { id?: unknown; quantity?: unknown };
        const id = Number(candidate.id);
        const quantity = Number(candidate.quantity);

        if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
          return null;
        }

        return { id, quantity };
      })
      .filter((item): item is { id: number; quantity: number } => item !== null);

    if (parsedItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: items must include valid id and quantity" },
        { status: 400 }
      );
    }

    // Fetch product details from the database
    const productIds = parsedItems.map((item) => item.id);
    const products = await client.db.product.findMany({
      where: { id: { in: productIds } },
    });

    // Create line items for Stripe
    const lineItems = parsedItems.map((item) => {
        const product = products.find((p) => p.id === item.id);

        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        return {
          price_data: {
            currency: "aud",
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.imageUrl],
            },
            unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the checkout session" },
      { status: 500 }
    );
  }
}
