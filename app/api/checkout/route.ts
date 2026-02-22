import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CartItem } from "@/hooks/use-cart";
import { initializeFlutterwavePayment } from "@/lib/flutterwave";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Product items are required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required for checkout" }, { status: 400 });
    }

    // Calculate total amount in Naira
    let totalAmount = 0;
    items.forEach((product: CartItem) => {
      totalAmount += Number(product.price) * product.quantity;
    });

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Total amount must be greater than 0" }, { status: 400 });
    }

    // Check for custom items and ensure placeholder exists
    const hasCustomItems = items.some((item: any) => item.category === "custom");
    let customProductId = "";

    if (hasCustomItems) {
      const placeholder = await db.product.findFirst({
        where: { title: "Custom Design Placeholder" }
      });

      if (placeholder) {
        customProductId = placeholder.id;
      } else {
        let customCategory = await db.category.findFirst({ where: { category: "Custom" } });
        if (!customCategory) {
          customCategory = await db.category.findFirst();
        }

        if (customCategory) {
          const newPlaceholder = await db.product.create({
            data: {
              title: "Custom Design Placeholder",
              description: "Placeholder for custom user designs",
              price: 0,
              featured: false,
              category: customCategory.category,
              categoryId: customCategory.id,
              imageURLs: ["/placeholder.png"]
            }
          });
          customProductId = newPlaceholder.id;
        } else {
          return NextResponse.json({ error: "Store setup incomplete (no categories)" }, { status: 500 });
        }
      }
    }

    const order = await db.order.create({
      data: {
        isPaid: false,
        userEmail: email,
        totalAmount: totalAmount,
        orderItems: {
          create: items.map((product: CartItem) => ({
            productName: product.title,
            customDesign: product.customDesign,
            customDesignBack: product.customDesignBack,
            product: {
              connect: {
                id: product.category === "custom" ? customProductId : product.id,
              },
            },
          })),
        },
      },
    });

    const tx_ref = `BP_${order.id}_${crypto.randomBytes(4).toString("hex")}`;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const flwData = await initializeFlutterwavePayment({
      tx_ref,
      amount: totalAmount,
      currency: "NGN",
      redirect_url: `${baseUrl}/payment/callback?tx_ref=${tx_ref}&order_id=${order.id}`,
      customer: {
        email,
      },
      meta: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: flwData.link });
  } catch (error: any) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
