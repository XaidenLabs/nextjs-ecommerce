import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    const productSizes = await db.productSize.findMany({
      where: {
        productId: id,
      },
    });

    const orderItems = await db.orderItem.findMany({
      where: {
        productId: id,
      },
    });

    await Promise.all(
      orderItems.map(async (orderItem) => {
        await db.orderItem.delete({
          where: {
            id: orderItem.id,
          },
        });
      })
    );

    await Promise.all(
      productSizes.map(async (productSize) => {
        await db.productSize.delete({
          where: {
            id: productSize.id,
          },
        });
      })
    );

    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    // const imageKey = product?.imageURLs;

    const task = await db.product.delete({
      where: {
        id,
      },
    });

    // Cloudinary deletion logic could go here if we tracked public_ids

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: "Error deleting task", status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        productSizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Error getting product", status: 500 });
  }
}
