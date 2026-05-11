"use client";

import Image from "next/image";
import { useState } from "react";

export default function R2UploadImageExample() {
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type
        })
      });

      const uploadPayload = await uploadRes.json();

      if (!uploadRes.ok || !uploadPayload.success) {
        throw new Error(uploadPayload.message || "Failed to create upload URL");
      }

      const { key, uploadUrl, headers } = uploadPayload.data;
      try {
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers,
          body: file
        });

        if (!putRes.ok) {
          throw new Error(`Upload to R2 failed with status ${putRes.status}`);
        }
      } catch (uploadError) {
        console.error("R2 PUT upload failed", {
          fileName: file.name,
          fileType: file.type,
          error: uploadError
        });
        throw uploadError;
      }

      setFileKey(key);

      const fileRes = await fetch(`/api/files/${encodeURIComponent(key)}`);
      const filePayload = await fileRes.json();

      if (!fileRes.ok || !filePayload.success) {
        throw new Error(filePayload.message || "Failed to get file URL");
      }

      setImageUrl(filePayload.data.fileUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        accept="image/*"
        type="file"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
          setError("");
        }}
      />

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        disabled={!file || isUploading}
        onClick={handleUpload}
        type="button"
      >
        {isUploading ? "Uploading..." : "Upload image"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {fileKey ? <p className="text-sm">Stored key: {fileKey}</p> : null}

      {imageUrl ? (
        <Image
          alt="Uploaded image"
          className="rounded border"
          height={320}
          src={imageUrl}
          unoptimized
          width={320}
        />
      ) : null}
    </div>
  );
}
