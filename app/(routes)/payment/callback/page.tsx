"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import useCart from "@/hooks/use-cart";

type State = "verifying" | "success" | "failed";

export default function PaymentCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const removeAllCart = useCart((state) => state.removeAllCart);
    const [state, setState] = useState<State>("verifying");
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if (hasRun) return;
        setHasRun(true);

        const transactionId = searchParams.get("transaction_id");
        const txRef = searchParams.get("tx_ref");
        const orderId = searchParams.get("order_id");
        const status = searchParams.get("status");

        if (status === "cancelled") {
            setState("failed");
            return;
        }

        if (!transactionId && !txRef) {
            setState("failed");
            return;
        }

        const params = new URLSearchParams();
        if (transactionId) params.set("transaction_id", transactionId);
        if (txRef) params.set("tx_ref", txRef);
        if (orderId) params.set("order_id", orderId);

        axios
            .get(`/api/verify-payment?${params.toString()}`)
            .then((res) => {
                if (res.data.verified) {
                    removeAllCart();
                    setState("success");
                } else {
                    setState("failed");
                }
            })
            .catch(() => {
                setState("failed");
            });
    }, [searchParams, removeAllCart, hasRun]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {state === "verifying" && (
                    <>
                        <Loader2 size={64} className="mx-auto text-black animate-spin mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Verifying payment...</h1>
                        <p className="text-gray-500">
                            Please wait while we confirm your payment with Flutterwave.
                        </p>
                    </>
                )}

                {state === "success" && (
                    <>
                        <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
                        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-gray-500 mb-8">
                            Your order has been placed and is being processed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/orders"
                                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition font-medium"
                            >
                                View My Orders
                            </Link>
                            <Link
                                href="/"
                                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition font-medium"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}

                {state === "failed" && (
                    <>
                        <XCircle size={80} className="mx-auto text-red-500 mb-6" />
                        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
                        <p className="text-gray-500 mb-8">
                            We could not verify your payment. If money was deducted, please
                            contact support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/cart"
                                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition font-medium"
                            >
                                Back to Cart
                            </Link>
                            <Link
                                href="/orders"
                                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition font-medium"
                            >
                                View Orders
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
