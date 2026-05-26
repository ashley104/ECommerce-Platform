import { client } from "@repo/db/client";
import { createOrder, markOrderPaid } from "@repo/db/orders";

export const storefrontEmail = "storefront.tester@example.com";

export async function createPaidOrderForStorefrontUser(productId: number, quantity = 1) {
  const user = await client.db.user.upsert({
    where: { email: storefrontEmail },
    update: { name: "Storefront Tester" },
    create: {
      email: storefrontEmail,
      name: "Storefront Tester",
      emailVerified: new Date(),
    },
  });

  const order = await createOrder({
    userId: user.id,
    items: [{ productId, quantity }],
    paymentProvider: "MOCK",
  });

  await markOrderPaid(order.id);

  return order.id;
}

export async function deleteOrder(orderId: string) {
  await client.db.order.delete({ where: { id: orderId } });
}