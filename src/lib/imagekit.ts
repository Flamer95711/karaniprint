import { ImageKit } from '@imagekit/nodejs';

// DO NOT instantiate ImageKit at module level — the constructor validates
// the private key format and will throw if the key is a placeholder.
// Use getImageKitClient() inside server actions only, guarded by isImageKitConfigured().

export function isImageKitConfigured(): boolean {
  const key = process.env.IMAGEKIT_PRIVATE_KEY ?? '';
  return key.length > 0 && key !== 'your_imagekit_private_key_here';
}

/** Returns a fresh ImageKit client. Only call after confirming isImageKitConfigured(). */
export function getImageKitClient(): ImageKit {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
  return new ImageKit({ privateKey });
}
