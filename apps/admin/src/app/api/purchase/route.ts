import { NextResponse } from "next/server";
import { listOrders } from "@repo/db/orders";

export async function GET() {
	const orders = await listOrders();

	const mapped = orders.map((o) => ({
		id: o.id,
		userId: o.user?.id ?? null,
		userEmail: o.user?.email ?? null,
		status: o.status,
		createdAt: o.createdAt?.toISOString?.() ?? null,
		paidAt: o.paidAt?.toISOString?.() ?? null,
		paymentProvider: o.paymentProvider,
		total: Number(o.total),
		items: o.items.map((it) => ({
			id: it.id,
			productId: it.product?.id ?? it.productId,
			product: it.product ? { id: it.product.id, name: it.product.name, imageUrl: it.product.imageUrl } : null,
			productName: it.productName,
			quantity: it.quantity,
			unitPrice: Number(it.unitPrice),
			totalPrice: Number(it.totalPrice),
		})),
	}));

	return NextResponse.json(mapped);
}
