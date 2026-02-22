import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
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

        const users = await db.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.log("[USERS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
