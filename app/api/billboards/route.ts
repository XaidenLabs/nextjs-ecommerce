import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFileToCloudinary(file: Buffer, fileName: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", public_id: `billboards/${fileName.split('.')[0]}` },
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
    const file: File | null = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = await uploadFileToCloudinary(buffer, file.name) as string;

    const requestData = formData.get("billboard") as string;
    const productInfo = JSON.parse(requestData);
    const title = productInfo;

    if (!title || title.length < 4) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const billboard = await db?.billboard.create({
      data: {
        billboard: title,
        imageURL: fileName,
      },
    });
    return NextResponse.json({ msg: "Successful create billboard", billboard });
  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" });
  }
}

export async function GET(req: Request) {
  try {
    const category = await db.billboard.findMany();
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({
      error: "Error getting billboards.",
      status: 500,
    });
  }
}
