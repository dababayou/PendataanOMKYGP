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
    if (res.error) {
      setLoading(false)
      setError(res.error)
    } else {
      router.push(res.redirectTo ?? '/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #10002b 0%, #902681 30%, #480ca8 60%, #00a54d 95%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
          style={{ background: '#902681' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
          style={{ background: '#00a54d' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: '#d12027' }} />
      </div>

      <header className="absolute top-0 left-0 w-full z-20 px-6 py-8 flex items-center justify-between pointer-events-none">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all shadow-lg active:scale-95">
            ← Beranda
          </Link>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center shadow-xl">
            <img src="/logo.png" alt="OMK YGP" className="h-6 w-6 object-contain" />
          </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Welcome area */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Selamat Datang</h1>
          <p className="text-white/60 text-sm font-bold uppercase tracking-widest mt-1">OMK Yohanes Gabriel Perboyre</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-10 relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #d12027, #00a54d, #902681)' }} />
          
          {step === 'email' ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Login Member</h2>
                <p className="text-gray-500 font-medium mt-1">
                  Masukkan email untuk menerima kode akses.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 text-sm font-bold">{error}</p>
                  </div>
                )}

                <Input
                  label="Email Kamu"
                  type="email"
                  placeholder="contoh: nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" size="lg" loading={loading} className="w-full text-lg">
                  {loading ? 'Mengirim...' : '🚀 Kirim Kode OTP'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8">
                <button
                  onClick={() => { setStep('email'); setError(''); setOtp('') }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-black rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest mb-4"
                >
                  ← Ganti Email
                </button>
                
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 mb-6 font-medium">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">OTP dikirim ke</p>
                    <p className="text-sm text-green-800 font-bold break-all">{email}</p>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Verifikasi</h2>
                <p className="text-gray-500 font-medium mt-1">
                  Masukkan kode OTP yang kami kirim ke email kamu.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                    <p className="text-red-700 text-sm font-bold">{error}</p>
                  </div>
                )}

                <Input
                  label="Kode OTP"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="••••••••"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-3xl font-black tracking-[0.5em] h-20 bg-gray-50 border-2"
                />

                <Button type="submit" size="lg" loading={loading} className="w-full text-lg">
                  {loading ? 'Memverifikasi...' : '✨ Masuk Ke Dashboard'}
                </Button>

                <p className="text-center text-sm font-bold text-gray-400">
                  Gak dapet email?{' '}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-brand-green hover:underline decoration-2"
                  >
                    Kirim ulang aja
                  </button>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/50 text-sm font-bold mt-10 uppercase tracking-widest">
          Belum kedaftar?{' '}
          <Link href="/register" className="text-white hover:text-green-300 underline decoration-2 underline-offset-4 transition-colors">
            Ayo Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
