import { mediaApi } from '../services/api';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please upload a valid image file.';
  if (file.size > MAX_IMAGE_BYTES) return 'File size must be less than 5 MB.';
  return null;
}

/** Upload to API when available; fall back to a local object URL for offline dev. */
export async function uploadImageWithFallback(
  file: File,
  templateId: string | undefined,
  assetType: string,
  assetKey: string,
): Promise<string> {
  try {
    const result = await mediaApi.upload(file, templateId ?? null, assetType, assetKey);
    return result.url as string;
  } catch {
    return URL.createObjectURL(file);
  }
}
