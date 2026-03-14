'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerMember } from '@/app/actions/register'
import { Input, Select, TextArea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const WILAYAH_OPTIONS = [
  'Edmund 1', 'Edmund 2', 'Edmund 3',
  'Felisitas 1', 'Felisitas 2',
  'Fransiskus Xaverius 1', 'Fransiskus Xaverius 2',
  'Hieronimus 1', 'Hieronimus 2',
  'Maria Medali Wasiat 1', 'Maria Medali Wasiat 2',
  'Maria Ratu Rosari 1', 'Maria Ratu Rosari 2',
  'Veronica 1', 'Veronica 2',
].map((w) => ({ value: w, label: w }))

interface FormErrors {
  nama_lengkap?: string
  alamat?: string
  nomor_telepon?: string
  email?: string
  wilayah?: string
  tanggal_lahir?: string
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama_lengkap: '',
    alamat: '',
    nomor_telepon: '',
    email: '',
    wilayah: '',
    tanggal_lahir: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; uniqueNumber?: string; error?: string } | null>(null)

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.nama_lengkap.trim()) newErrors.nama_lengkap = 'Nama lengkap wajib diisi.'
    if (!form.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi.'
    if (!form.nomor_telepon.trim()) newErrors.nomor_telepon = 'Nomor telepon wajib diisi.'
    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid.'
    }
    if (!form.wilayah) newErrors.wilayah = 'Wilayah wajib dipilih.'
    if (!form.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const res = await registerMember(form)
    setResult(res)
    setLoading(false)
  }

  if (result?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Success card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-500 mb-8">Selamat datang di OMK YGP. Nomor unik Anda adalah:</p>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8">
              <p className="text-indigo-200 text-sm mb-2 font-medium tracking-wider uppercase">Nomor Anggota</p>
              <p className="text-8xl font-bold text-white tracking-widest font-mono">
                {result.uniqueNumber}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Simpan nomor ini. Anda juga dapat melihatnya kapan saja dengan login menggunakan email.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-center"
              >
                Login untuk Lihat Dashboard
              </Link>
              <Link
                href="/"
                className="w-full py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
          ← Kembali ke Beranda
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Form header card */}
        <div className="bg-indigo-600 rounded-t-2xl px-8 py-6 border-b-4 border-indigo-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">✟</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Formulir Pendataan</h1>
              <p className="text-indigo-200 text-sm">Orang Muda Katolik Yohanes Gabriel Palu</p>
            </div>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Isi formulir di bawah ini dengan data yang benar dan lengkap. Setelah mendaftar, Anda akan mendapatkan nomor anggota unik.
          </p>
        </div>

        {/* Form body */}
        <Card padding="lg" className="rounded-t-none rounded-b-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {result?.error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm">{result.error}</p>
              </div>
            )}

            <div className="border-l-4 border-indigo-500 pl-4">
              <h2 className="font-semibold text-gray-800">Data Pribadi</h2>
              <p className="text-xs text-gray-500">Lengkapi semua kolom bertanda *</p>
            </div>

            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap Anda"
              required
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              error={errors.nama_lengkap}
            />

            <TextArea
              label="Alamat"
              placeholder="Masukkan alamat lengkap Anda"
              required
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              error={errors.alamat}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nomor Telepon"
                placeholder="08xx-xxxx-xxxx"
                type="tel"
                required
                value={form.nomor_telepon}
                onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
                error={errors.nomor_telepon}
              />

              <Input
                label="Email"
                placeholder="nama@email.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                hint="Email akan digunakan untuk login"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Wilayah"
                required
                value={form.wilayah}
                onChange={(e) => setForm({ ...form, wilayah: e.target.value })}
                error={errors.wilayah}
                options={WILAYAH_OPTIONS}
                placeholder="Pilih wilayah..."
              />

              <Input
                label="Tanggal Lahir"
                type="date"
                required
                value={form.tanggal_lahir}
                onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                error={errors.tanggal_lahir}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Memproses pendaftaran...' : 'Daftar Sekarang'}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Sudah pernah mendaftar?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                  Login di sini
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
