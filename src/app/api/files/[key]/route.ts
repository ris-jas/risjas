import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

import { getR2BucketName, getR2Client } from "@/lib/r2";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    key: string;
  };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const key = params?.key ? decodeURIComponent(params.key) : "";

    if (!key) {
      return NextResponse.json(
        { success: false, message: "File key is required" },
        { status: 400 }
      );
    }

    const getCommand = new GetObjectCommand({
      Bucket: getR2BucketName(),
      Key: key
    });

    const fileUrl = await getSignedUrl(getR2Client(), getCommand, { expiresIn: 300 });

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
