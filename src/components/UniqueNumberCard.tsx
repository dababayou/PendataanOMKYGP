'use client'

import { useState, useEffect } from 'react'
import { redeemCode } from '@/app/actions/redeem'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface UniqueNumberCardProps {
  uniqueNumber: string
  isRedeemed: boolean
  email: string
}

export function UniqueNumberCard({
  uniqueNumber,
  isRedeemed: initialIsRedeemed,
  email,
}: UniqueNumberCardProps) {
  const [isRedeemed, setIsRedeemed] = useState(initialIsRedeemed)
  
  // Sync state if prop changes (e.g., after admin toggle)
  useEffect(() => {
    setIsRedeemed(initialIsRedeemed)
  }, [initialIsRedeemed])

  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRedeem() {
    setError('')
    setLoading(true)
    const res = await redeemCode(email, password)
    setLoading(false)

    if (res.success) {
      setIsRedeemed(true)
      setShowModal(false)
    } else {
      setError(res.error || 'Password salah atau terjadi kesalahan.')
    }
  }

  if (isRedeemed) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center min-h-[320px] shadow-inner">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 opacity-50">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-900 font-black text-2xl tracking-tight">Kode Ditukarkan</p>
        <p className="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest text-center">
          Kode Unik Sudah<br />Berhasil Ditukarkan
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-[3rem] p-10 text-center shadow-[0_30px_70px_-15px_rgba(144,38,129,0.3)] h-full flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden group"
        style={{ background: 'linear-gradient(145deg, #902681 0%, #480ca8 40%, #00a54d 100%)' }}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
          </svg>
        </div>
        
        <p className="text-white/60 text-[10px] font-black tracking-[0.5em] uppercase mb-4 relative z-10">Nomor Anggota</p>
        <p className="text-[7rem] font-black text-white tracking-widest leading-none relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] font-mono">
          {uniqueNumber}
        </p>
        
        <button
          onClick={() => setShowModal(true)}
          className="mt-10 px-8 py-3 bg-white text-gray-900 font-black rounded-2xl flex items-center gap-2 hover:bg-gray-100 transition-all hover:-translate-y-1 active:translate-y-0 shadow-2xl text-sm relative z-10"
        >
          🎁 Tukarkan Snack
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-sm p-10 border-4 border-white animate-pop">
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Konfirmasi Tukar</h3>
            <p className="text-gray-500 font-medium mb-8">
              Masukkan password konfirmasi dari panitia untuk menukarkan snack.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleRedeem(); }} className="flex flex-col gap-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">
                  {error}
                </div>
              )}
              
              <Input
                label="Password Panitia"
                type="password"
                placeholder="••••••"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 font-black"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-[2] text-white font-black"
                >
                  Konfirmasi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
