'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UpdateMemberData {
  nama_lengkap?: string
  alamat_ktp?: string
  alamat_domisili?: string
  nomor_telepon?: string
  wilayah?: string
  tanggal_lahir?: string
  is_stasi_ygp?: boolean
  asal_paroki_stasi?: string
  status_pendidikan?: string
  kelas_sekolah?: string
  nama_sekolah_kampus?: string
}

export async function updateMember(email: string, data: UpdateMemberData) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('members')
    .update({
      ...data,
    })
    .eq('email', email)

  if (error) {
    console.error('Update member error details:', error)
    return { success: false, error: `Gagal: ${error.message}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  
  return { success: true }
}

export async function toggleRedemptionStatus(id: string, is_redeemed: boolean) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('members')
    .update({ is_redeemed })
    .eq('id', id)

  if (error) {
    console.error('Toggle redemption error details:', error)
    return { success: false, error: `Gagal: ${error.message}` }
  }

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  
  return { success: true }
}
