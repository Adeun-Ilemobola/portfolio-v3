import { api } from "./eden";


const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export function validateImageFile(input: {
  fileName: string;
  contentType: string;
  size?: number;
}) {
  if (!ALLOWED_IMAGE_TYPES.has(input.contentType)) {
    throw new Error("Unsupported image type.");
  }

  if (input.size && input.size > 10 * 1024 * 1024) {
    throw new Error("File is too large. Max 10MB.");
  }

  const safeName = input.fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");

  return safeName;
}

export function buildObjectKey(fileName: string , id: string) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  return `portfolio/${new Date().getFullYear()}/${id}.${ext}`;
}

export function getPublicFileUrl(key: string) {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
  if (!base) {
    throw new Error("Missing NEXT_PUBLIC_R2_PUBLIC_BASE_URL");
  }
  return `${base.replace(/\/$/, "")}/${key}`;
}

export async function uploadSingleFile(fileBL: File, id: string): Promise<{url: string, key: string}> {
  const { data, error, status } = await api.file.upload.post({
    file: fileBL,
    id,
  });

  if (error) {
    const value = error.value as { message?: string } | undefined;
    const message = value?.message ?? `Upload failed with status ${status}`;
    console.error("Upload failed:", message);
    throw new Error(message);
  }

  if (!data?.success || !data?.data?.url) {
    const message = data?.message ?? "Upload failed";
    console.error("Upload failed:", message);
    throw new Error(message);
  }

  return {
    url: data.data.url,
    key: data.data.key,
  };
}

export async function deleteSingleFile(cloudKey: string): Promise<{success: boolean , message: string}> {
    const { data, error, status } = await api.file.delete.post({
        key: cloudKey,
    });

    if (error) {
        const value = error.value as { message?: string } | undefined;
        const message = value?.message ?? `Delete failed with status ${status}`;
        console.error("Delete failed:", message);
        throw new Error(message);
    }

    if (!data?.success) {
        const message = data?.message ?? "Delete failed";
        console.error("Delete failed:", message);
        throw new Error(message);
    }

    return {
        success: data.success,
        message: data.message,
    };
}


