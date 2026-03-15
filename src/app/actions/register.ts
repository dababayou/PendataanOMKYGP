'use server'

import { createServiceClient } from '@/lib/supabase/server'

function padNumber(n: number): string {
  return n.toString().padStart(3, '0')
}

async function generateUniqueNumber(supabase: ReturnType<typeof createServiceClient>): Promise<string> {
  const MAX_ATTEMPTS = 200
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const num = Math.floor(Math.random() * 1000)
    const formatted = padNumber(num)

    const { data, error } = await supabase
      .from('members')
      .select('unique_number')
      .eq('unique_number', formatted)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) return formatted // not taken
  }
  throw new Error('Tidak dapat menghasilkan nomor unik setelah beberapa percobaan. Silhakan coba lagi.')
}

export interface RegisterFormData {
  nama_lengkap: string
  alamat_ktp: string
  alamat_domisili: string
  nomor_telepon: string
  email: string
  wilayah: string
  tanggal_lahir: string
  is_stasi_ygp: boolean
  asal_paroki_stasi?: string
  status_pendidikan: string
  kelas_sekolah?: string
  nama_sekolah_kampus?: string
}

export interface RegisterResult {
  success: boolean
  uniqueNumber?: string
  error?: string
}

export async function registerMember(data: RegisterFormData): Promise<RegisterResult> {
  // Basic server-side validation
  if (
    !data.nama_lengkap.trim() ||
    !data.alamat_ktp.trim() ||
    !data.alamat_domisili.trim() ||
    !data.nomor_telepon.trim() ||
    !data.email.trim() ||
    !data.wilayah.trim() ||
    !data.tanggal_lahir ||
    !data.status_pendidikan
  ) {
    return { success: false, error: 'Semua kolom wajib diisi.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Format email tidak valid.' }
  }

  const supabase = createServiceClient()

  // Check for duplicate email in members table
  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('email', data.email.toLowerCase().trim())
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Email sudah terdaftar. Silakan login untuk melihat nomor unik Anda.' }
  }

  // Generate unique number
  let uniqueNumber: string
  try {
    uniqueNumber = await generateUniqueNumber(supabase)
  } catch (err) {
    return { success: false, error: String(err) }
  }

  // Insert member record
  const { error: insertError } = await supabase.from('members').insert({
    nama_lengkap: data.nama_lengkap.trim(),
    alamat_ktp: data.alamat_ktp.trim(),
    alamat_domisili: data.alamat_domisili.trim(),
    nomor_telepon: data.nomor_telepon.trim(),
    email: data.email.toLowerCase().trim(),
    wilayah: data.wilayah,
    tanggal_lahir: data.tanggal_lahir,
    is_stasi_ygp: data.is_stasi_ygp,
    asal_paroki_stasi: data.asal_paroki_stasi?.trim(),
    status_pendidikan: data.status_pendidikan,
    kelas_sekolah: data.kelas_sekolah,
    nama_sekolah_kampus: data.nama_sekolah_kampus?.trim(),
    unique_number: uniqueNumber,
  })

  if (insertError) {
    // Race condition: unique_number already taken between check and insert
    if (insertError.code === '23505' && insertError.message.includes('unique_number')) {
      return registerMember(data) // retry
    }
    if (insertError.code === '23505' && insertError.message.includes('email')) {
      return { success: false, error: 'Email sudah terdaftar.' }
    }
    return { success: false, error: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.' }
  }

  // Invite/sign-up the user in Supabase Auth so they can log in later via OTP
  await supabase.auth.admin.inviteUserByEmail(data.email.toLowerCase().trim(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/dashboard`,
  })

  return { success: true, uniqueNumber }
}
