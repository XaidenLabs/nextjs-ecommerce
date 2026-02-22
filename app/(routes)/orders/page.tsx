"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

type OrderItem = {
    id: string;
    productName: string;
    product: {
        imageURLs: string[];
        price: number;
    };
};

type Order = {
    id: string;
    isPaid: boolean;
    status: string;
    trackingNumber: string;
    totalAmount: number;
    userEmail: string;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
};

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

const statusIcons: Record<string, React.ReactNode> = {
    Pending: <Clock size={20} />,
    Processing: <Package size={20} />,
    Shipped: <Truck size={20} />,
    Delivered: <CheckCircle size={20} />,
};

const MyOrdersPage = () => {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (authStatus === "authenticated") {
            axios
                .get("/api/my-orders")
                .then((res) => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [authStatus, router]);

    if (authStatus === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                <p className="text-gray-500 mb-8">
                    Track and manage your orders
                </p>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No orders yet</p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const currentStepIndex = statusSteps.indexOf(order.status);
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div
                                    key={order.id}
                                    className="border rounded-lg overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <button
                                        onClick={() =>
                                            setExpandedOrder(isExpanded ? null : order.id)
                                        }
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`p-2 rounded-full ${order.status === "Delivered"
                                                        ? "bg-green-100 text-green-600"
                                                        : order.status === "Shipped"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                            >
                                                {statusIcons[order.status] || <Clock size={20} />}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-sm">
                                                    Order #{order.id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString(
                                                        "en-NG",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold">
                                                    ₦
                                                    {order.totalAmount.toLocaleString("en-NG", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </p>
                                                <p
                                                    className={`text-xs font-medium ${order.isPaid ? "text-green-600" : "text-red-500"
                                                        }`}
                                                >
                                                    {order.isPaid ? "Paid" : "Unpaid"}
                                                </p>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp size={20} className="text-gray-400" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t px-4 py-5 bg-gray-50">
                                            {/* Status Progress Bar */}
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between relative">
                                                    {statusSteps.map((step, index) => (
                                                        <div
                                                            key={step}
                                                            className="flex flex-col items-center z-10"
                                                        >
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index <= currentStepIndex
                                                                        ? "bg-black text-white"
                                                                        : "bg-gray-200 text-gray-500"
                                                                    }`}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                            <p
                                                                className={`text-xs mt-1 ${index <= currentStepIndex
                                                                        ? "text-black font-medium"
                                                                        : "text-gray-400"
                                                                    }`}
                                                            >
                                                                {step}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    {/* Progress line */}
                                                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                                                        <div
                                                            className="h-full bg-black transition-all duration-500"
                                                            style={{
                                                                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tracking Number */}
                                            {order.trackingNumber && (
                                                <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                                                    <p className="text-xs text-blue-600 font-medium">
                                                        Tracking Number
                                                    </p>
                                                    <p className="font-mono text-sm font-bold">
                                                        {order.trackingNumber}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Order Items */}
                                            <div className="space-y-3">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Items
                                                </p>
                                                {order.orderItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 bg-white p-3 rounded-md border"
                                                    >
                                                        <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                            <Image
                                                                src={item.product.imageURLs[0]}
                                                                alt={item.productName}
                                                                fill
                                                                className="object-cover"
                                                                sizes="56px"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">
                                                                {item.productName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                ₦
                                                                {Number(item.product.price).toLocaleString(
                                                                    "en-NG",
                                                                    { minimumFractionDigits: 2 }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
