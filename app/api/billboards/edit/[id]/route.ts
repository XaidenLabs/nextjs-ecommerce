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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  try {


    const billboard = await db.billboard.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    return NextResponse.json({ error: "Error getting billboard", status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  try {
    const formData = await req.formData();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const file: File | null = formData.get("file") as File;
    const requestData = formData.get("billboard") as string;
    const productInfo = JSON.parse(requestData);
    const title = productInfo;

    let fileName: string | undefined;

    if (file && file instanceof File && file.name) {
      const imageName = file.name;
      const buffer = Buffer.from(await file.arrayBuffer());
      fileName = await uploadFileToCloudinary(buffer, imageName) as string;
    }

    if (!title || title.length < 4) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const updateData: {
      billboard: string;
      imageURL?: string;
    } = {
      billboard: title,
    };

    if (fileName) {
      updateData.imageURL = fileName;
    }
    const product = await db.billboard.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json({ product, msg: "Successful edit billboard" });
  } catch (error) {
    return NextResponse.json({
      error: "Error ediiting billboard",
      status: 500,
    });
  }
}

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
    const billboard = await db.billboard.findUnique({
      where: {
        id,
      },
    });

    const imageKey = billboard?.imageURL;

    const task = await db.billboard.delete({
      where: {
        id,
      },
    });

    // Cloudinary delete logic can be added here if needed
    // const publicId = imageKey?.split('/').pop()?.split('.')[0];
    // if (publicId) await cloudinary.uploader.destroy(`billboards/${publicId}`);

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({
      error: "Error deleting billboard",
      status: 500,
    });
  }
}
