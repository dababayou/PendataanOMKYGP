import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import AdminClient from './AdminClient'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
  if (!adminEmails.includes((user.email ?? '').toLowerCase())) redirect('/dashboard')

  const serviceSupabase = createServiceClient()
  const { data: members, error } = await serviceSupabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fef2f2 100%)' }}>
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="OMK YGP" className="h-10 w-10 object-contain transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900 tracking-tighter uppercase">OMK YGP</span>
              <span className="px-2 py-0.5 bg-brand-green text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Admin</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block">
              Logged as: <span className="text-gray-900">{user.email}</span>
            </span>
            <Link
              href="/dashboard"
              className="text-xs font-black text-brand-purple border-2 border-brand-purple/20 px-4 py-2 rounded-xl hover:bg-brand-purple hover:text-white transition-all uppercase tracking-widest"
            >
              Dashboard Anggota
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
             Admin Central
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Database Anggota 📂</h1>
          <p className="text-gray-500 font-bold mt-2 text-lg">Halaman ini khusus untuk manajemen data OMK Stasi Yohanes Gabriel Perboyre.</p>
        </div>

        {error ? (
          <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-[2.5rem] p-10 flex items-center gap-6 shadow-xl text-red-700">
             <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
               <span className="text-3xl">🚫</span>
             </div>
             <div>
               <p className="font-black text-xl tracking-tight leading-none uppercase">Gagal Memuat Data</p>
               <p className="font-medium mt-2">{error.message}</p>
             </div>
          </div>
        ) : (
          <AdminClient initialMembers={members ?? []} />
        )}
      </main>

      <footer className="text-center py-10 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
         Penjaga Data OMK Stasi Yohanes Gabriel Perboyre
      </footer>
    </div>
  )
}
