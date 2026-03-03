// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";

const PLAN_PRICES: Record<string, string> = {
  monthly: "7.00",
  quarterly: "29.00",
  semiannual: "75.00",
  lifetime: "149.00",
};

const PAYPAL_API =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error("❌ Failed to get PayPal access token:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json(
        { error: "Invalid or missing plan" },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[plan];

    const accessToken = await getAccessToken();

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
            description: `Plan: ${plan}`,
          },
        ],
        application_context: {
          brand_name: "SocialLike",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
        },
      }),
    });

    const orderData = await orderRes.json();

    if (!orderData.id) {
      console.error("❌ Failed to create order:", orderData);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: orderData.id });
  } catch (err) {
    console.error("❌ [CREATE ORDER] Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}