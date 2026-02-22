import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers.get("verif-hash");

  // Verify webhook signature
  if (!secretHash || signature !== secretHash) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = await req.json();

  if (event.event === "charge.completed" && event.data.status === "successful") {
    const { meta } = event.data;
    const orderId = meta?.orderId;

    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          phone: event.data.customer?.phone_number || "",
        },
        include: {
          orderItems: true,
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
