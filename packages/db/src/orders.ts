import { client } from "./client.js";
import type { Product } from "./data.js";

type OrderItemInput = { productId: number; quantity: number };

export async function createOrder(opts: {
  userId: string;
  items: OrderItemInput[];
  paymentProvider?: "MOCK" | "STRIPE" | "PAYPAL";
}) {
  const { userId, items, paymentProvider = "MOCK" } = opts;

  // Load product prices
  const productIds = items.map((i) => i.productId);
  const products = await client.db.product.findMany({ where: { id: { in: productIds } } });

  const productMap = new Map(products.map((p: any) => [p.id, p]));

  let subtotal = 0;

  const orderItemsData = items.map((it) => {
    const p = productMap.get(it.productId as number) as Product;
    const unitPrice = Number(p.price);
    const totalPrice = unitPrice * it.quantity;
    subtotal += totalPrice;

    return {
      productId: it.productId,
      quantity: it.quantity,
      productName: p.name,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
    };
  });

  const total = subtotal; // taxes/shipping can be added later

  // Create order and items in a transaction
  const result = await client.db.$transaction(async (tx: any) => {
    const order = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
        paymentProvider: paymentProvider as any,
        subtotal: subtotal as any,
        total: total as any,
      },
    });

    for (const oi of orderItemsData) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: oi.productId,
          quantity: oi.quantity,
          productName: oi.productName,
          unitPrice: oi.unitPrice as any,
          totalPrice: oi.totalPrice as any,
        },
      });

      // decrement stock
      await tx.product.update({ where: { id: oi.productId }, data: { stock: { decrement: oi.quantity } } });
    }

    return order;
  });

  return result;
}

export async function getOrdersByUser(userId: string) {
  return client.db.order.findMany({ where: { userId }, include: { items: { include: { product: true } } } });
}

export async function getOrderById(id: string) {
  return client.db.order.findUnique({ where: { id }, include: { items: { include: { product: true } }, user: true } });
}

export async function markOrderPaid(id: string, paidAt?: Date) {
  return client.db.order.update({ where: { id }, data: { status: "PAID", paidAt: paidAt ?? new Date() } });
}

export async function listOrders() {
  return client.db.order.findMany({ include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: "desc" } });
}
