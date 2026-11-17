import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { uploadService } from "@/services/upload.service";

const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024);
const folders = new Set(["risjas", "risjas/products", "risjas/banners"]);

function isImage(buffer: Buffer, type: string) {
  if (type === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/jpeg") return buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
  if (type === "image/gif") return buffer.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/) !== null;
  if (type === "image/webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");
    const folder = typeof folderValue === "string" && folders.has(folderValue) ? folderValue : "risjas";
    if (!(file instanceof File)) return errorResponse("File is required", {}, 400);
    if (file.size <= 0 || file.size > MAX_BYTES) return errorResponse("File size is invalid", {}, 413);
    if (!["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.type)) return errorResponse("Invalid image type", {}, 415);
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isImage(buffer, file.type)) return errorResponse("Invalid image content", {}, 415);
    const uploaded = await uploadService.uploadBuffer(buffer, folder);
    return successResponse("Upload successful", { imageUrl: uploaded.secure_url, publicId: uploaded.public_id });
  } catch (error) {
    console.error("[upload] failed", error);
    return errorResponse("Upload failed", {}, 500);
  }
}
