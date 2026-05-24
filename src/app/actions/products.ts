'use server';

import { revalidatePath } from 'next/cache';

// ═══════════════════════════════════════════════
// Types — no runtime import, safe at module level
// ═══════════════════════════════════════════════
export type Product = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  origin: string | null;
  stock_status: string;
  image_url: string | null;
  imagekit_file_id: string | null;
  colors: string[];
  sizes: string[];
  lots: { qty: number; price: number }[];
};

type ActionResult =
  | { success: true; data?: Product }
  | { success: false; error: string };

// ═══════════════════════════════════════════════
// Helpers — dynamically import heavy Node packages
// so they're never loaded at module-parse time
// ═══════════════════════════════════════════════
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return url.startsWith('https://') && key.length > 20;
}

function isImageKitConfigured(): boolean {
  const key = process.env.IMAGEKIT_PRIVATE_KEY ?? '';
  return key.length > 0 && key !== 'your_imagekit_private_key_here';
}

async function getSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getImageKit() {
  const mod = await import('@imagekit/nodejs');
  const ImageKit = mod.default || mod.ImageKit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (ImageKit as any)({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  });
}

// ═══════════════════════════════════════════════
// READ
// ═══════════════════════════════════════════════
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured — returning empty product list.');
    return [];
  }
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getProducts error:', error.message);
      return [];
    }
    return (data as Product[]) ?? [];
  } catch (err) {
    console.error('getProducts exception:', err);
    return [];
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('getProduct error:', error.message);
      return null;
    }
    return data as Product;
  } catch (err) {
    console.error('getProduct exception:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════
// HELPER — upload image
// ═══════════════════════════════════════════════
async function uploadImageToImageKit(
  file: File,
  folder = '/artisan-marketplace/products'
): Promise<{ url: string; fileId: string }> {
  const ik = await getImageKit();
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  const result = await ik.files.upload({
    file: buffer as unknown as Blob,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return { url: result.url!, fileId: result.fileId! };
}

// ═══════════════════════════════════════════════
// CREATE
// ═══════════════════════════════════════════════
export async function createProduct(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured. Fill in .env.local credentials.' };
  }
  try {
    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      base_price: parseFloat(formData.get('base_price') as string),
      origin: (formData.get('origin') as string) || null,
      stock_status: formData.get('stock_status') as string,
      image_url: (formData.get('image_url') as string) || null,
      imagekit_file_id: (formData.get('imagekit_file_id') as string) || null,
      colors: JSON.parse((formData.get('colors') as string) || '[]'),
      sizes: JSON.parse((formData.get('sizes') as string) || '[]'),
      lots: JSON.parse((formData.get('lots') as string) || '[]'),
    };

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    return { success: true, data: data as Product };
  } catch (err) {
    console.error('createProduct error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ═══════════════════════════════════════════════
// UPDATE
// ═══════════════════════════════════════════════
export async function updateProduct(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    const newImageUrl = (formData.get('image_url') as string) || null;
    const newImagekitFileId = (formData.get('imagekit_file_id') as string) || null;
    const existingImagekitFileId = (formData.get('existing_imagekit_file_id') as string) || null;

    // If a new image was uploaded and there was an old one, delete the old one
    if (newImagekitFileId && newImagekitFileId !== existingImagekitFileId && existingImagekitFileId && isImageKitConfigured()) {
      try {
        const ik = await getImageKit();
        await ik.files.delete(existingImagekitFileId);
      } catch {
        console.warn('Could not delete old ImageKit file:', existingImagekitFileId);
      }
    }

    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      base_price: parseFloat(formData.get('base_price') as string),
      origin: (formData.get('origin') as string) || null,
      stock_status: formData.get('stock_status') as string,
      image_url: newImageUrl,
      imagekit_file_id: newImagekitFileId,
      colors: JSON.parse((formData.get('colors') as string) || '[]'),
      sizes: JSON.parse((formData.get('sizes') as string) || '[]'),
      lots: JSON.parse((formData.get('lots') as string) || '[]'),
      updated_at: new Date().toISOString(),
    };

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    return { success: true, data: data as Product };
  } catch (err) {
    console.error('updateProduct error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ═══════════════════════════════════════════════
// DELETE
// ═══════════════════════════════════════════════
export async function deleteProduct(id: number): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();

    const { data: product } = await supabase
      .from('products')
      .select('imagekit_file_id')
      .eq('id', id)
      .single();

    if (product?.imagekit_file_id && isImageKitConfigured()) {
      try {
        const ik = await getImageKit();
        await ik.files.delete(product.imagekit_file_id);
      } catch {
        console.warn('Could not delete ImageKit file:', product.imagekit_file_id);
      }
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('deleteProduct error:', err);
    return { success: false, error: (err as Error).message };
  }
}
