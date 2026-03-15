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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #10002b 0%, #902681 30%, #480ca8 65%, #00a54d 100%)' }}
      >
        {/* Animated Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[100px] opacity-30" style={{ background: '#902681' }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-[100px] opacity-30" style={{ background: '#00a54d' }} />
        </div>

        <div className="max-w-md w-full relative z-10 text-center">
          <div className="bg-white rounded-[3rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] px-8 py-12 border-4 border-white">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 transform transition-transform hover:rotate-0 duration-300"
              style={{ background: 'linear-gradient(135deg, #00a54d, #007a38)' }}>
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Berhasil! 🎉</h2>
            <p className="text-gray-500 font-bold mb-10 px-4">Kamu resmi jadi bagian dari OMK YGP. Silakan login ke dashboard untuk melihat nomor unik kamu!</p>

            <div className="bg-gray-50 rounded-[2.5rem] p-10 mb-10 relative overflow-hidden border-2 border-dashed border-gray-200">
               <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #d12027, #00a54d, #902681)' }} />
               <p className="text-[10px] text-gray-400 font-black tracking-[.4em] uppercase mb-4">Kode Unik Kamu</p>
               <p className="text-8xl font-black tracking-widest font-mono text-gray-200 drop-shadow-sm select-none">
                 ###
               </p>
            </div>

            <p className="text-sm text-gray-400 font-medium mb-10 leading-relaxed max-w-[280px] mx-auto">
              Keamanan data kamu prioritas kami. Kode lengkap hanya bisa dilihat setelah kamu login.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="w-full py-5 font-black rounded-2xl text-center text-white transition-all shadow-[0_15px_30px_-5px_rgba(0,165,77,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(0,165,77,0.5)] text-lg"
                style={{ background: 'linear-gradient(135deg, #00a54d, #007a38)' }}
              >
                Gas Login Sekarang →
              </Link>
              <Link
                href="/"
                className="w-full py-4 text-gray-400 font-black hover:text-gray-600 transition-colors text-center uppercase tracking-widest text-xs"
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
    <div className="min-h-screen py-16 px-4"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fef2f2 100%)' }}
    >
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10" style={{ background: '#902681' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10" style={{ background: '#00a54d' }} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header with back link */}
        <div className="mb-10 flex items-center justify-between">
           <Link href="/" className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm font-black transition-all group">
             <span className="bg-brand-green/10 w-8 h-8 rounded-xl flex items-center justify-center group-hover:-translate-x-1 duration-200">←</span>
             BERANDA
           </Link>
           <img src="/logo.png" alt="OMK YGP" className="h-10 w-10 object-contain drop-shadow-lg" />
        </div>

        {/* Main form card */}
        <div className="bg-white rounded-[3rem] shadow-[0_35px_80px_-20px_rgba(0,165,77,0.15)] overflow-hidden border border-gray-100">
          {/* Fun header section */}
          <div className="px-10 py-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #902681, #6a1b5c)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/10 rounded-full translate-y-16 -translate-x-16" />
            
            <h1 className="text-4xl font-black text-white tracking-tight mb-2 relative z-10">Daftar Member ✨</h1>
            <p className="text-purple-100 font-bold text-lg relative z-10 drop-shadow-sm">
              Jadi bagian dari keluarga besar OMK YGP sekarang juga!
            </p>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              {result?.error && (
                <div className="flex items-start gap-3 p-5 bg-red-50 border-2 border-dashed border-red-200 rounded-[1.5rem] animate-shake">
                   <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                     <span className="text-red-500 text-xl font-bold">!</span>
                   </div>
                   <div>
                     <p className="text-red-800 font-black text-sm uppercase tracking-widest mb-1">Wah, Ada Error Nih</p>
                     <p className="text-red-600/80 text-sm font-medium">{result.error}</p>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {/* Personal Info Group */}
                <div className="md:col-span-2 flex items-center gap-4 mb-2">
                   <div className="w-1.5 h-8 rounded-full" style={{ background: '#00a54d' }} />
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">Data Pribadi Kamu</h2>
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Nama Lengkap"
                    placeholder="Contoh: Yohanes Gabriel"
                    required
                    value={form.nama_lengkap}
                    onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
                    error={errors.nama_lengkap}
                  />
                </div>

                <div className="md:col-span-2">
                  <TextArea
                    label="Alamat Lengkap"
                    placeholder="Tulis alamat rumah kamu di sini ya..."
                    required
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    error={errors.alamat}
                  />
                </div>

                <Input
                  label="Nomor WhatsApp"
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  required
                  value={form.nomor_telepon}
                  onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
                  error={errors.nomor_telepon}
                />

                <Input
                  label="Alamat Email"
                  placeholder="nama@email.com"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  hint="Email ini buat kamu login ke depannya"
                />

                <Select
                  label="Wilayah / Stasi"
                  required
                  value={form.wilayah}
                  onChange={(e) => setForm({ ...form, wilayah: e.target.value })}
                  error={errors.wilayah}
                  options={WILAYAH_OPTIONS}
                  placeholder="Pilih wilayah kamu..."
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

              <div className="pt-6 border-t border-gray-100">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full text-xl py-6 rounded-[2rem]"
                >
                  {loading ? 'Sabar Ya, Lagi Diproses...' : '🔥 Daftar Jadi Member Sekarang!'}
                </Button>
                
                <p className="text-center text-sm font-bold text-gray-400 mt-8">
                  Dah pernah daftar? {' '}
                  <Link href="/login" className="text-brand-green hover:underline decoration-2 underline-offset-4">
                    Langsung Login Aja
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
