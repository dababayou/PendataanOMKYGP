'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sendOtp, verifyOtp } from '@/app/actions/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type Step = 'email' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email wajib diisi.'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError('Format email tidak valid.'); return }

    setLoading(true)
    const res = await sendOtp(email)
    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      setStep('otp')
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!otp.trim() || otp.length < 6) { setError('Masukkan kode OTP dari email Anda.'); return }

    setLoading(true)
    const res = await verifyOtp(email, otp)
    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      router.push(res.redirectTo ?? '/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <span className="text-white text-3xl">✟</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Masuk ke Akun</h1>
          <p className="text-indigo-300 text-sm mt-1">OMK Yohanes Gabriel Palu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 'email' ? (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Login dengan Email</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Kami akan mengirimkan kode OTP ke email Anda.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Input
                  label="Alamat Email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  {loading ? 'Mengirim kode...' : 'Kirim Kode OTP'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => { setStep('email'); setError(''); setOtp('') }}
                  className="text-indigo-600 text-sm hover:underline flex items-center gap-1 mb-4"
                >
                  ← Ganti email
                </button>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg mb-4">
                  <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Kode OTP dikirim ke</p>
                    <p className="text-sm font-medium text-gray-800">{email}</p>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Masukkan Kode OTP</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Periksa inbox atau folder spam email Anda.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Input
                  label="Kode OTP"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Masukkan kode OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-[0.3em] font-mono"
                />

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                </Button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-indigo-600 transition-colors text-center disabled:opacity-50"
                >
                  Tidak menerima kode? <span className="text-indigo-600 font-medium">Kirim ulang</span>
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-indigo-300 text-sm mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-white font-medium hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
