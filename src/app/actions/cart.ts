'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════
// Service role client (bypasses RLS — server only)
// ═══════════════════════════════════════════════
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ═══════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════
export type CartItem = {
  id: string;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined product data (when fetched with select)
  product?: {
    id: number;
    name: string;
    base_price: number;
    image_url: string | null;
    category: string;
    origin: string | null;
    lots: { qty: number; price: number }[];
  };
};

type CartResult =
  | { success: true; data?: CartItem }
  | { success: false; error: string };

// ═══════════════════════════════════════════════
// GET CART ITEMS (with product join)
// ═══════════════════════════════════════════════
export async function getCartItems(): Promise<CartItem[]> {
  try {
    // Auth check with anon client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Use service role so the product join is never blocked by RLS
    const db = getServiceClient();
    const { data, error } = await db
      .from('cart_items')
      .select(`
        *,
        product:products (
          id, name, base_price, image_url, category, origin, lots
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('getCartItems error:', error.message);
      return [];
    }
    return (data as CartItem[]) ?? [];
  } catch (err) {
    console.error('getCartItems exception:', err);
    return [];
  }
}

// ═══════════════════════════════════════════════
// ADD / UPSERT CART ITEM
// ═══════════════════════════════════════════════
export async function addCartItem(
  productId: number,
  quantity: number
): Promise<CartResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const db = getServiceClient();

    // Check if item already exists
    const { data: existing } = await db
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      // Update quantity
      const { data, error } = await db
        .from('cart_items')
        .update({
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { success: true, data: data as CartItem };
    }

    // Insert new
    const { data, error } = await db
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data: data as CartItem };
  } catch (err) {
    console.error('addCartItem error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ═══════════════════════════════════════════════
// UPDATE QUANTITY
// ═══════════════════════════════════════════════
export async function updateCartItem(
  id: string,
  quantity: number
): Promise<CartResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const db = getServiceClient();
    const { data, error } = await db
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data: data as CartItem };
  } catch (err) {
    console.error('updateCartItem error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ═══════════════════════════════════════════════
// REMOVE SINGLE ITEM
// ═══════════════════════════════════════════════
export async function removeCartItem(id: string): Promise<CartResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const db = getServiceClient();
    const { error } = await db
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err) {
    console.error('removeCartItem error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ═══════════════════════════════════════════════
// CLEAR CART
// ═══════════════════════════════════════════════
export async function clearCartItems(): Promise<CartResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const db = getServiceClient();
    const { error } = await db
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err) {
    console.error('clearCartItems error:', err);
    return { success: false, error: (err as Error).message };
  }
}
