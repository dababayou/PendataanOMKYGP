'use client'

import { useState, useMemo } from 'react'

interface Member {
  id: string
  nama_lengkap: string
  email: string
  nomor_telepon: string
  alamat: string
  wilayah: string
  tanggal_lahir: string
  unique_number: string
  created_at: string
}

interface AdminClientProps {
  members: Member[]
}

export function AdminClient({ members }: AdminClientProps) {
  const [search, setSearch] = useState('')
  const [wilayahFilter, setWilayahFilter] = useState('')

  const wilayahList = useMemo(() => {
    return Array.from(new Set(members.map((m) => m.wilayah))).sort()
  }, [members])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return members.filter((m) => {
      const matchSearch =
        !q ||
        m.nama_lengkap.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.unique_number.includes(q) ||
        m.nomor_telepon.includes(q)
      const matchWilayah = !wilayahFilter || m.wilayah === wilayahFilter
      return matchSearch && matchWilayah
    })
  }, [members, search, wilayahFilter])

  function exportCSV() {
    const headers = ['No. Unik', 'Nama Lengkap', 'Email', 'Nomor Telepon', 'Wilayah', 'Tanggal Lahir', 'Alamat', 'Terdaftar']
    const rows = filtered.map((m) => [
      m.unique_number,
      m.nama_lengkap,
      m.email,
      m.nomor_telepon,
      m.wilayah,
      m.tanggal_lahir,
      `"${m.alamat.replace(/"/g, '""')}"`,
      new Date(m.created_at).toLocaleDateString('id-ID'),
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `anggota-omk-ygp-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Anggota', value: members.length, color: 'text-indigo-600' },
          { label: 'Hasil Pencarian', value: filtered.length, color: 'text-purple-600' },
          { label: 'Nomor Digunakan', value: members.length, color: 'text-green-600' },
          { label: 'Sisa Nomor', value: 1000 - members.length, color: 'text-orange-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama, email, nomor unik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>
          <select
            value={wilayahFilter}
            onChange={(e) => setWilayahFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
          >
            <option value="">Semua Wilayah</option>
            {wilayahList.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Unik</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Wilayah</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telepon</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Lahir</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                    Tidak ada anggota yang ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-bold text-base">
                        {m.unique_number}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">{m.nama_lengkap}</td>
                    <td className="px-5 py-4 text-gray-600">{m.email}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium ring-1 ring-purple-200">
                        {m.wilayah}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{m.nomor_telepon}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {new Date(m.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Menampilkan {filtered.length} dari {members.length} anggota
          </div>
        )}
      </div>
    </div>
  )
}
