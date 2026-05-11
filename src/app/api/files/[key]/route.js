import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

import { r2BucketName, r2Client } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  try {
    const key = params?.key ? decodeURIComponent(params.key) : "";

    if (!key) {
      return NextResponse.json(
        { success: false, message: "File key is required" },
        { status: 400 }
      );
    }

    const getCommand = new GetObjectCommand({
      Bucket: r2BucketName,
      Key: key
    });

    const fileUrl = await getSignedUrl(r2Client, getCommand, { expiresIn: 300 });

    return NextResponse.json({
      success: true,
      data: {
        key,
        fileUrl
      }
    });
  } catch (error) {
    console.error("Failed to generate file URL", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate file URL" },
      { status: 500 }
    );
  }
}
