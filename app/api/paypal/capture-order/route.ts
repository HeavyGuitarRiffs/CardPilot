// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";

const PLAN_PRICES: Record<string, string> = {
  monthly: "7.00",
  quarterly: "29.00",
  semiannual: "75.00",
  lifetime: "149.00",
};

export async function POST(req: Request) {
  try {
    const { orderID, plan } = await req.json();

    console.log("💳 [CAPTURE ORDER] Incoming:", { orderID, plan });

    if (!orderID || !plan) {
      return NextResponse.json(
        { error: "Missing orderID or plan" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.PAYPAL_ENV === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = await response.json();
    console.log("💳 [CAPTURE ORDER] PayPal response:", data);

    // PayPal error guard
    if (!data || data.name === "UNPROCESSABLE_ENTITY") {
      return NextResponse.json(
        { error: "PayPal rejected capture request", details: data },
        { status: 400 }
      );
    }

    if (data.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed", data },
        { status: 400 }
      );
    }

    const capture =
      data.purchase_units?.[0]?.payments?.captures?.[0];

    if (!capture) {
      return NextResponse.json(
        { error: "No capture record found", data },
        { status: 400 }
      );
    }

    const captureAmount = capture.amount?.value;
    const expectedAmount = PLAN_PRICES[plan];

    if (captureAmount !== expectedAmount) {
      return NextResponse.json(
        {
          error: "Captured amount does not match plan",
          captureAmount,
          expectedAmount,
        },
        { status: 400 }
      );
    }

    console.log("💳 [CAPTURE ORDER] SUCCESS:", {
      plan,
      amount: captureAmount,
      orderID,
      captureId: capture.id,
    });

    return NextResponse.json({
      status: "COMPLETED",
      plan,
      amount: captureAmount,
      captureId: capture.id,
    });
  } catch (err) {
    console.error("❌ [CAPTURE ORDER] Error:", err);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}