import { env } from "@/lib/env";

export interface CloudflareUploadResult {
  id: string;
  variants: string[];
}

export function getDeliveryUrl(
  imageId: string,
  variant: "public" | "thumbnail" | "hero" = "public",
): string {
  const base =
    env.CLOUDFLARE_IMAGES_DELIVERY_URL ??
    `https://imagedelivery.net/${env.CLOUDFLARE_ACCOUNT_ID}`;

  return `${base}/${imageId}/${variant}`;
}

export async function uploadImage(
  file: Blob,
  metadata?: Record<string, string>,
): Promise<CloudflareUploadResult | null> {
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_IMAGES_TOKEN) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata));
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_IMAGES_TOKEN}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(`Cloudflare Images upload failed: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    result: CloudflareUploadResult;
  };

  return data.result;
}
