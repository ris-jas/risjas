import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { uploadService } from "@/services/upload.service";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "risjas";

    if (!(file instanceof File)) {
      return errorResponse("File is required", {}, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadService.uploadBuffer(buffer, folder);

    return successResponse("Upload successful", {
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id
    });
  } catch (error: any) {
    return errorResponse(error.message || "Upload failed", {}, 400);
  }
}