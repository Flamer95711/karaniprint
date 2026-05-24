import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Type matching the Supabase `products` table schema
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

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return url.startsWith('https://') && key.length > 20;
}

// Lazy singleton — client is created only on first use, never at import time
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _client;
}
