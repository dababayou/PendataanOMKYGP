'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function sendOtp(email: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'

  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: {
      shouldCreateUser: false, // user must register first
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes('not found') || error.message.includes('registered')) {
      return { error: 'Email tidak ditemukan. Silakan daftar terlebih dahulu.' }
    }
    return { error: error.message }
  }

  return {}
}

export async function verifyOtp(
  email: string,
  token: string
): Promise<{ error?: string; redirectTo?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email: email.toLowerCase().trim(),
    token,
    type: 'email',
  })

  if (error) {
    return { error: 'Kode OTP tidak valid atau sudah kadaluarsa. Silakan coba lagi.' }
  }

  // Send admin to /admin, everyone else to /dashboard
  const adminEmail = process.env.ADMIN_EMAIL
  const redirectTo = email.toLowerCase().trim() === adminEmail ? '/admin' : '/dashboard'

  return { redirectTo }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
