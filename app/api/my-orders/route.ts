import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/my-orders - returns orders for the current logged-in user
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await db.order.findMany({
            where: {
                userEmail: session.user.email,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("[MY_ORDERS_GET]", error);
        return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
    }
}
