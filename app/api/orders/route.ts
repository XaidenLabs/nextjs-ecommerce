import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Error getting orders.", status: 500 });
  }
}
