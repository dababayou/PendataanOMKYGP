'use server'

import { createServiceClient } from '@/lib/supabase/server'

const REDEEM_PASSWORD = process.env.REDEEM_PASSWORD || 'ommkygp'

export async function redeemCode(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (password !== REDEEM_PASSWORD) {
    return { success: false, error: 'Password salah. Silakan coba lagi.' }
  }

  const supabase = createServiceClient()

  // Double-check not already redeemed
  const { data: member } = await supabase
    .from('members')
    .select('is_redeemed')
    .eq('email', email)
    .maybeSingle()

  if (member?.is_redeemed) {
    return { success: false, error: 'Kode ini sudah pernah ditukarkan.' }
  }

  const { error } = await supabase
    .from('members')
    .update({ is_redeemed: true })
    .eq('email', email)

  if (error) {
    return { success: false, error: 'Gagal menyimpan data. Silakan coba lagi.' }
  }

  return { success: true }
}
