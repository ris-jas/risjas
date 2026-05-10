import cloudinary from "@/lib/cloudinary";

export const uploadService = {
  uploadBuffer(buffer: Buffer, folder: string) {
    return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) return reject(error || new Error("Upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );
      stream.end(buffer);
    });
  }
};
