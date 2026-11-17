import cloudinary from "@/lib/cloudinary";

export const uploadService = {
  uploadBuffer(buffer: Buffer, folder: string) {
    const maxBytes = Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024);
    return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image", allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"], max_bytes: maxBytes },
        (error, result) => {
          if (error || !result) return reject(error || new Error("Upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );
      stream.end(buffer);
    });
  }
};
