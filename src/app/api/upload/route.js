import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

import { r2BucketName, r2Client } from "@/lib/r2";

export const runtime = "nodejs";

const sanitizeExtension = (fileName = "", fileType = "") => {
  const fromName = fileName.includes(".") ? fileName.split(".").pop() : "";
  const fromType = fileType.includes("/") ? fileType.split("/").pop() : "";
  const ext = (fromName || fromType || "bin").toLowerCase();
  return ext.replace(/[^a-z0-9]/g, "") || "bin";
};

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { success: false, message: "fileName is required" },
        { status: 400 }
      );
    }
    if (!fileType || !fileType.includes("/")) {
      return NextResponse.json(
        { success: false, message: "A valid fileType is required" },
        { status: 400 }
      );
    }

    const extension = sanitizeExtension(fileName, fileType);
    const key = `${crypto.randomUUID()}.${extension}`;
    const contentType = fileType.trim();

    const putCommand = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: key,
      ContentType: contentType
    });

    const uploadUrl = await getSignedUrl(r2Client, putCommand, { expiresIn: 60 });

    return NextResponse.json({
      success: true,
      data: {
        key,
        uploadUrl,
        method: "PUT",
        headers: {
          "Content-Type": contentType
        }
      }
    });
  } catch (error) {
    console.error("Failed to generate upload URL", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
