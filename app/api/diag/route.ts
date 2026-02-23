import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    const diag = {
        env: {
            DATABASE_URL: process.env.DATABASE_URL ? "SET (starts with " + process.env.DATABASE_URL.substring(0, 10) + "...)" : "MISSING",
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
            NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "MISSING",
        },
        dbConnection: "Checking...",
        error: null as any,
    };

    try {
        // Attempt a simple query
        const userCount = await db.user.count();
        diag.dbConnection = `SUCCESS (User count: ${userCount})`;
    } catch (err: any) {
        diag.dbConnection = "FAILED";
        diag.error = {
            message: err.message,
            code: err.code,
            meta: err.meta,
            stack: err.stack?.split("\n").slice(0, 3) // First 3 lines of stack
        };
    }

    return NextResponse.json(diag);
}
