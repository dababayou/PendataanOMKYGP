import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { UniqueNumberCard } from '@/components/UniqueNumberCard'
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
          <p className="text-gray-500 font-bold mt-2 text-lg">Senang melihat kamu kembali di OMK YGP.</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Unique Number Card */}
            <div className="lg:col-span-1">
               <UniqueNumberCard
                 uniqueNumber={member.unique_number}
                 isRedeemed={member.is_redeemed ?? false}
                 email={member.email}
               />
            </div>

            {/* Member Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 overflow-hidden relative">
                {/* Accent strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #d12027, #00a54d, #902681)' }} />
                
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Profil Member ✨</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Nama Lengkap', value: member.nama_lengkap, icon: '👤', color: '#00a54d', bg: '#f0fdf4' },
                    { label: 'Email Terdaftar', value: member.email, icon: '✉️', color: '#902681', bg: '#fef2f2' },
                    { label: 'Wilayah / Stasi', value: member.wilayah, icon: '📍', color: '#d12027', bg: '#fdf2f2' },
                    { label: 'Nomor WhatsApp', value: member.nomor_telepon, icon: '📱', color: '#00a54d', bg: '#f0fdf4' },
                    {
                      label: 'Ulang Tahun',
                      value: new Date(member.tanggal_lahir).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      }),
                      icon: '🎂', color: '#902681', bg: '#fef2f2'
                    },
                    {
                      label: 'Tanggal Join',
                      value: new Date(member.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      }),
                      icon: '📅', color: '#d12027', bg: '#fdf2f2'
                    },
                  ].map(({ label, value, icon, color, bg }) => (
                    <div key={label} className="flex items-center gap-5 p-5 rounded-[2rem] transition-all hover:scale-[1.02] duration-300" 
                         style={{ background: bg, border: `1px solid ${color}15` }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg" 
                           style={{ background: 'white', color }}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: `${color}cc` }}>{label}</p>
                        <p className="text-gray-900 font-black tracking-tight leading-snug">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] mb-4">🏠 Alamat Pengiriman / Rumah</h2>
                <p className="text-gray-700 font-bold leading-relaxed text-lg">{member.alamat}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
