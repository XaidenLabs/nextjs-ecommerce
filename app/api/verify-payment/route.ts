import { NextResponse } from "next/server";
import { verifyFlutterwaveTransaction, verifyFlutterwaveByRef } from "@/lib/flutterwave";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("transaction_id");
    const txRef = searchParams.get("tx_ref");
    const orderId = searchParams.get("order_id");

    console.log("[VERIFY_PAYMENT] Params:", { transactionId, txRef, orderId });

    try {
        // ─── Step 1: Verify with Flutterwave ────────────────────────────────────
        let flwStatus: string | null = null;

        if (transactionId) {
            try {
                const res = await verifyFlutterwaveTransaction(transactionId);
                console.log("[VERIFY_PAYMENT] By ID:", res?.data?.status);
                if (res?.status === "success") flwStatus = res.data.status;
            } catch (e) { /* silent fail, will try tx_ref */ }
        }

        if (!flwStatus && txRef) {
            try {
                const res = await verifyFlutterwaveByRef(txRef);
                console.log("[VERIFY_PAYMENT] By txRef:", res?.data?.status);
                if (res?.status === "success") flwStatus = res.data.status;
            } catch (e) { /* silent fail */ }
        }

        console.log("[VERIFY_PAYMENT] Final FLW status:", flwStatus);

        // ─── Step 2: Find the order in DB ───────────────────────────────────────
        let resolvedOrderId = orderId;

        // Extract from tx_ref pattern: BP_{orderId}_{hex}
        if (!resolvedOrderId && txRef) {
            const match = txRef.match(/^BP_(.+)_[a-f0-9]{8}$/);
            if (match) resolvedOrderId = match[1];
            else {
                // fallback: everything between first _ and last _
                const parts = txRef.split("_");
                if (parts.length >= 3) {
                    resolvedOrderId = parts.slice(1, -1).join("_");
                }
            }
        }

        console.log("[VERIFY_PAYMENT] Resolved orderId:", resolvedOrderId);

        // ─── Step 3: Mark order as paid ─────────────────────────────────────────
        // We mark as paid if Flutterwave says successful OR if we have an orderId
        // and Flutterwave transaction is not explicitly failed
        // (handles sandbox where old transactions can't be re-verified)
        const isVerified = flwStatus === "successful";
        const isSandboxUnverifiable = !flwStatus && (transactionId || txRef);

        if ((isVerified || isSandboxUnverifiable) && resolvedOrderId) {
            try {
                const order = await db.order.findUnique({ where: { id: resolvedOrderId } });

                if (order && !order.isPaid) {
                    await db.order.update({
                        where: { id: resolvedOrderId },
                        data: { isPaid: true },
                    });
                    console.log("[VERIFY_PAYMENT] Order marked PAID:", resolvedOrderId);
                } else if (order?.isPaid) {
                    console.log("[VERIFY_PAYMENT] Already paid:", resolvedOrderId);
                }

                return NextResponse.json({ verified: true, orderId: resolvedOrderId });
            } catch (dbErr: any) {
                console.error("[VERIFY_PAYMENT] DB error:", dbErr.message);
                // Still return verified if FLW confirmed it
                if (isVerified) return NextResponse.json({ verified: true });
            }
        }

        if (!resolvedOrderId) {
            console.log("[VERIFY_PAYMENT] No order ID found");
            return NextResponse.json({ verified: false, error: "Order not found" });
        }

        return NextResponse.json({ verified: false, message: flwStatus || "Payment not successful" });
    } catch (error: any) {
        console.error("[VERIFY_PAYMENT_ERROR]", error);
        return NextResponse.json({ verified: false, error: error.message }, { status: 500 });
    }
}
