import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { DashboardContent } from '@/components/DashboardContent'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
  const isAdmin = adminEmails.includes((user.email ?? '').toLowerCase())

  // Fetch member data using service client (to bypass RLS safely on server)
  const serviceSupabase = createServiceClient()
  const { data: member, error } = await serviceSupabase
    .from('members')
    .select('*')
    .eq('email', user.email!)
    .maybeSingle()

  const firstName = member?.nama_lengkap?.split(' ')[0] ?? 'Anggota'

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fef2f2 100%)' }}>
      {/* Subtle decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.05]" style={{ background: '#902681' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.05]" style={{ background: '#00a54d' }} />
      </div>

      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="OMK YGP" className="h-10 w-10 object-contain transition-transform group-hover:scale-110" />
            <span className="font-black text-gray-900 tracking-tighter">OMK YGP</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs font-black text-brand-green border-2 border-brand-green/20 px-4 py-2 rounded-xl hover:bg-brand-green hover:text-white transition-all uppercase tracking-widest shadow-sm"
              >
                Panel Admin
              </Link>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest px-4 py-2 hover:bg-red-50 rounded-xl"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
            Dashboard Anggota
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Halo, {firstName}! 👋</h1>
          <p className="text-gray-500 font-bold mt-2 text-lg">Senang melihat kamu di OMK YGP.</p>
        </div>

        {error || !member ? (
          <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-[2.5rem] p-10 flex items-center gap-6 shadow-xl">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <p className="font-black text-amber-800 text-xl tracking-tight leading-none">Data tidak ditemukan</p>
              <p className="text-amber-700 font-medium mt-2">Email kamu belum terdaftar sebagai anggota. Silakan daftar dulu ya!</p>
            </div>
          </div>
        ) : (
          <DashboardContent member={member} isAdmin={isAdmin} />
        )}
      </main>
    </div>
  )
}
