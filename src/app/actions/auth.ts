'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// ═══════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════
export type AuthResult =
  | { success: true }
  | { success: false; error: string };

export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_admin: boolean;
};

// ═══════════════════════════════════════════════
// SIGNUP
// ═══════════════════════════════════════════════
export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const phone = (formData.get('phone') as string) || null;

  if (!email || !password || !first_name || !last_name) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        phone,
      },
    },
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ═══════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════
export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ═══════════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════════
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

// ═══════════════════════════════════════════════
// GET SESSION + PROFILE
// ═══════════════════════════════════════════════
export async function getSession(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  // Fetch the profile row for is_admin and other fields
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    // User exists in auth but profile doesn't — return basic info
    return {
      id: user.id,
      email: user.email ?? '',
      first_name: user.user_metadata?.first_name ?? '',
      last_name: user.user_metadata?.last_name ?? '',
      phone: user.user_metadata?.phone ?? null,
      is_admin: false,
    };
  }

  return {
    id: user.id,
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone: profile.phone,
    is_admin: profile.is_admin ?? false,
  };
}
