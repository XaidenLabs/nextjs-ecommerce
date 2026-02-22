"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

import useCart from "@/hooks/use-cart";
import CartItem from "./_components/cart-item";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Summary from "./_components/summary";
import { CheckCircle } from "lucide-react";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const cart = useCart();
  const removeAllCart = useCart((state) => state.removeAllCart);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Flutterwave payment callback
  useEffect(() => {
    if (!isMounted) return;

    const transactionId = searchParams.get("transaction_id");
    const txRef = searchParams.get("tx_ref");
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");

    if ((transactionId || txRef) && status === "successful" && !paymentSuccess && !verifying) {
      setVerifying(true);

      const params = new URLSearchParams();
      if (transactionId) params.set("transaction_id", transactionId);
      if (txRef) params.set("tx_ref", txRef);
      if (orderId) params.set("order_id", orderId);

      axios
        .get(`/api/verify-payment?${params.toString()}`)
        .then((res) => {
          if (res.data.verified) {
            toast.success("Payment completed! Your order has been placed.");
            removeAllCart();
            setPaymentSuccess(true);
          } else {
            toast.error("Payment could not be verified: " + (res.data.message || ""));
          }
          setVerifying(false);
        })
        .catch((err) => {
          console.error("Verify error:", err);
          toast.error("Error verifying payment.");
          setVerifying(false);
        });
    } else if (status === "cancelled") {
      toast.error("Payment was cancelled.");
    }
  }, [isMounted, searchParams, removeAllCart, paymentSuccess, verifying]);

  if (!isMounted) {
    return null;
  }

  // Show success state after payment
  if (paymentSuccess || (searchParams.get("status") === "successful" && verifying)) {
    return (
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          {verifying ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold mb-2">Verifying your payment...</h1>
              <p className="text-gray-500">Please wait while we confirm your payment.</p>
            </>
          ) : (
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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white ">
      <div className="mx-auto max-w-7xl min-h-screen">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          {cart.items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40">
              <ShoppingCartIcon style={{ fontSize: "10rem" }} />
              <p className="text-neutral-500">Your cart is empty.</p>
            </div>
          )}
          <div className="lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              <ul>
                {cart.items.map((item, index) => (
                  <CartItem key={index} data={item} />
                ))}
              </ul>
            </div>
            {cart.items.length > 0 && <Summary />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
