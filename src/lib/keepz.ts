import { Order } from "@/types";

interface KeepzPaymentResponse {
  success: boolean;
  transactionId: string;
  redirectUrl?: string;
  error?: string;
}

interface KeepzConfig {
  apiKey: string;
  merchantId: string;
  callbackUrl: string;
}

const config: KeepzConfig = {
  apiKey: process.env.KEEPZ_API_KEY || "mock-api-key",
  merchantId: process.env.KEEPZ_MERCHANT_ID || "mock-merchant",
  callbackUrl:
    process.env.KEEPZ_CALLBACK_URL || "http://localhost:3000/api/payment/callback",
};

export async function initiatePayment(
  order: Order
): Promise<KeepzPaymentResponse> {
  // In production, this would call the real Keepz API:
  // const response = await fetch("https://api.keepz.me/v1/payments", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": `Bearer ${config.apiKey}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     merchantId: config.merchantId,
  //     amount: order.total * 100, // amount in tetri
  //     currency: "GEL",
  //     orderId: order.id,
  //     callbackUrl: config.callbackUrl,
  //     description: `Komarovi Merch - Order #${order.id}`,
  //   }),
  // });

  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `KPZ-${Date.now()}`,
        redirectUrl: `https://pay.keepz.me/mock/${order.id}`,
      });
    }, 1000);
  });
}

export async function verifyPayment(
  transactionId: string
): Promise<{ verified: boolean; status: string }> {
  // Mock verification
  return { verified: true, status: "completed" };
}

export { config as keepzConfig };
