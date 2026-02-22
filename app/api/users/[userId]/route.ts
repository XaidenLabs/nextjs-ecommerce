import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the requester is an admin
        const currentUser = await db.user.findUnique({
            where: {
                email: session.user.email,
            }
        });

        if (!currentUser?.isAdmin) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (!params.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        const user = await db.user.delete({
            where: {
                id: params.userId,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("[USER_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
