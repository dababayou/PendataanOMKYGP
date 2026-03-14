import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch member data using service client (to bypass RLS safely on server)
  const serviceSupabase = createServiceClient()
  const { data: member, error } = await serviceSupabase
    .from('members')
    .select('*')
    .eq('email', user.email!)
    .maybeSingle()

  const firstName = member?.nama_lengkap?.split(' ')[0] ?? 'Anggota'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">✟</span>
            </div>
            <span className="font-semibold text-gray-800">OMK YGP</span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-indigo-600 text-sm font-medium mb-1">Dashboard Anggota</p>
          <h1 className="text-3xl font-bold text-gray-900">Selamat datang, {firstName}! 👋</h1>
          <p className="text-gray-500 mt-1">Ini adalah informasi keanggotaan Anda di OMK Yohanes Gabriel Palu.</p>
        </div>

        {error || !member ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <svg className="w-6 h-6 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-amber-800">Data anggota tidak ditemukan</p>
              <p className="text-sm text-amber-600 mt-1">Email Anda belum terdaftar sebagai anggota OMK YGP. Silakan daftar terlebih dahulu.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Nomor Unik — hero card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-center shadow-xl shadow-indigo-200 h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-3">Nomor Anggota</p>
                <p className="text-8xl font-bold text-white font-mono tracking-widest leading-none">
                  {member.unique_number}
                </p>
                <p className="text-indigo-300 text-xs mt-4">Nomor unik Anda di OMK YGP</p>
              </div>
            </div>

            {/* Member info */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Informasi Pribadi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Nama Lengkap', value: member.nama_lengkap, icon: '👤' },
                    { label: 'Email', value: member.email, icon: '✉️' },
                    { label: 'Wilayah', value: member.wilayah, icon: '📍' },
                    { label: 'Nomor Telepon', value: member.nomor_telepon, icon: '📱' },
                    {
                      label: 'Tanggal Lahir',
                      value: new Date(member.tanggal_lahir).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      }),
                      icon: '🎂'
                    },
                    {
                      label: 'Terdaftar Sejak',
                      value: new Date(member.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      }),
                      icon: '📅'
                    },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-sm text-gray-800 font-medium mt-0.5 leading-snug">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Alamat</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{member.alamat}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
