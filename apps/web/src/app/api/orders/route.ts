import { NextResponse, NextRequest } from "next/server";
import { client } from "@repo/db/client";
import { createOrder, markOrderPaid } from "@repo/db/orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

type IncomingItem = { productId: number; quantity: number };

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await client.db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const userId = user.id;

    const body = await request.json();

    const items: IncomingItem[] = body.items || [];

    const normalized = items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));
    
    // Create order (defaults to PENDING)
    const order = await createOrder({ userId, items: normalized, paymentProvider: "STRIPE" });

    // Mark order as paid since this is the success page callback
    const paid = await markOrderPaid(order.id, new Date());

    return NextResponse.json({ order: paid }, { status: 201 });
  } catch (err) {
    console.error("/api/orders error:", err);
    return NextResponse.json({ error: "Unable to create order" }, { status: 500 });
  }
}
