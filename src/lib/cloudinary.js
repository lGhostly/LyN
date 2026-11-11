import crypto from 'node:crypto';

const env = (k) => process.env[k] || import.meta.env[k] || '';
export const FOLDER = 'bazar';

const sign = (params) =>
  crypto.createHash('sha1')
    .update(Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&') + env('CLOUDINARY_API_SECRET'))
    .digest('hex');

// Firma para que el navegador suba la imagen directo a Cloudinary (sin pasar por Vercel).
export function uploadSignature() {
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    cloudName: env('CLOUDINARY_CLOUD_NAME'),
    apiKey: env('CLOUDINARY_API_KEY'),
    folder: FOLDER,
    timestamp,
    signature: sign({ folder: FOLDER, timestamp }),
  };
}

export async function destroyImage(publicId) {
  const params = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams({ ...params, api_key: env('CLOUDINARY_API_KEY'), signature: sign(params) });
  try {
    await fetch(`https://api.cloudinary.com/v1_1/${env('CLOUDINARY_CLOUD_NAME')}/image/destroy`, { method: 'POST', body });
  } catch {}
}
