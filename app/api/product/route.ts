import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFileToCloudinary(file: Buffer, fileName: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", public_id: `products/${fileName.split('.')[0]}` },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url);
        }
      }
    ).end(file);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const fileNames: string[] = [];
    if (!files) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (files) {
      for (const file of Array.from(files)) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = await uploadFileToCloudinary(buffer, file.name) as string;
          fileNames.push(fileName);
        }
      }
    }

    const requestData = formData.get("requestData") as string;
    const productInfo = JSON.parse(requestData);

    const {
      title,
      description,
      price,
      featured,
      category,
      sizes,
      categoryId,
      discount,
    } = productInfo;

    if (
      !title ||
      title.length < 4 ||
      !description ||
      description.length < 4 ||
      !price ||
      !fileNames ||
      !category
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    let priceDiscount: number = 0;
    if (discount > 0) {
      const mathDiscount = (discount / 100) * +price;
      priceDiscount = +price - mathDiscount;
    }

    const product = await db?.product.create({
      data: {
        title,
        description,
        price,
        featured,
        imageURLs: fileNames,
        category,
        categoryId,
        discount,
        finalPrice: priceDiscount,
        productSizes: {
          create: sizes.map((size: any) => ({
            size: { connect: { id: size.id } },
            name: size.name,
          })),
        },
      },
    });
    return NextResponse.json({ msg: "Successful create product", product });
  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" });
  }
}

export async function GET(req: Request) {
  try {
    const tasks = await db.product.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Error getting products", status: 500 });
  }
}
