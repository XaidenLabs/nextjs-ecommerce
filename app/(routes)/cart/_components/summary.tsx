"use client";

import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingDots from "./loading-dots";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Summary = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const router = useRouter();

  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAllCart = useCart((state) => state.removeAllCart);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAllCart();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }

    // Handle Flutterwave callback
    const transactionId = searchParams.get("transaction_id");
    const txRef = searchParams.get("tx_ref");
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");

    if (transactionId && status === "successful") {
      axios
        .get(`/api/verify-payment?transaction_id=${transactionId}&tx_ref=${txRef}&order_id=${orderId}`)
        .then((res) => {
          if (res.data.verified) {
            toast.success("Payment completed!");
            removeAllCart();
          } else {
            toast.error("Payment could not be verified.");
          }
        })
        .catch(() => {
          toast.error("Error verifying payment.");
        });
    } else if (transactionId && status === "cancelled") {
      toast.error("Payment was cancelled.");
    }
  }, [searchParams, removeAllCart]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.totalPrice);
  }, 0);

  const onCheckout = async () => {
    setLoading(true);
    if (!userEmail) {
      setLoading(false);
      return router.push("/api/auth/signin");
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/checkout`,
      {
        items,
        email: userEmail,
      }
    );
    setLoading(false);
    window.location = response.data.url;
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <p className="text-lg text-gray-900 font-semibold">
            ₦{Number(totalPrice).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <Button disabled={loading} onClick={onCheckout} className="w-full mt-6">
        {loading ? <LoadingDots /> : "Checkout"}
      </Button>
    </div>
  );
};

export default Summary;
