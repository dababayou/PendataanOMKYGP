import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { AdminClient } from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminEmail = process.env.ADMIN_EMAIL
  if (user.email !== adminEmail) redirect('/dashboard')

  const serviceSupabase = createServiceClient()
  const { data: members, error } = await serviceSupabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">✟</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">OMK YGP</span>
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
            <a
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Dashboard →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-gray-500 mt-1">Kelola data seluruh anggota OMK Yohanes Gabriel Palu.</p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            Terjadi kesalahan saat memuat data: {error.message}
          </div>
        ) : (
          <AdminClient members={members ?? []} />
        )}
      </main>
    </div>
  )
}
