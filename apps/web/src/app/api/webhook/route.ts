import Stripe from 'stripe';
import { stripe } from "@/functions/stripe";
import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { headers } from "next/headers";

export async function POST(request: Request) {
 
  const body = await request.text();
  const sig = request.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch(error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const orderData = {
      email: session.customer_details?.email || "",
      name: session.customer_details?.name || "",
      address: addressString,
      total: session.amount_total || 0,
      stripeSessionId: session.id,
    };

    // await client.db.order.create({ data: orderData });
    const productIds = session.metadata?.productIds ? JSON.parse(session.metadata.productIds) : [];
    const quantities = session.metadata?.quantities ? JSON.parse(session.metadata.quantities) : [];

    if (productIds.length !== quantities.length) {
      return NextResponse.json({ error: "Invalid metadata: productIds and quantities length mismatch" }, { status: 400 });
    }

    const orderItemsData = productIds.map((productId: number, index: number) => ({
      productId,
      quantity: quantities[index],
    }));

    // await client.db.order.create({
    //   data: {
    //     ...orderData,
    //     items: {
    //       create: orderItemsData,
    //     },
    //   },
    // });
  }
}