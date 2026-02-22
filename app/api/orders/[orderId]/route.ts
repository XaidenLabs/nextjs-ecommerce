import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { status, trackingNumber, isPaid } = body;

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentUser = await db.user.findUnique({
            where: {
                email: session.user.email,
            }
        });

        if (!currentUser?.isAdmin) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (!params.orderId) {
            return new NextResponse("Order ID is required", { status: 400 });
        }

        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
        if (isPaid !== undefined) updateData.isPaid = isPaid;

        const order = await db.order.update({
            where: {
                id: params.orderId,
            },
            data: updateData,
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
