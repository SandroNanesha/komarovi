import { NextResponse } from "next/server";
import { initiatePayment } from "@/lib/keepz";
import { Order } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();

  const order: Order = {
    id: `ORD-${Date.now()}`,
    items: body.items,
    total: body.total,
    customer: body.customer,
    status: "pending",
  };

  const paymentResult = await initiatePayment(order);

  if (paymentResult.success) {
    return NextResponse.json({
      success: true,
      orderId: order.id,
      transactionId: paymentResult.transactionId,
      redirectUrl: paymentResult.redirectUrl,
    });
  }

  return NextResponse.json(
    { success: false, error: paymentResult.error },
    { status: 400 }
  );
}
