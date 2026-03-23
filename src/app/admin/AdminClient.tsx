'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toggleRedemptionStatus } from '@/app/actions/members'

interface Member {
  id: string
  nama_lengkap: string
  email: string
  wilayah: string
  unique_number: string
  nomor_telepon: string
  alamat: string
  tanggal_lahir: string
  is_redeemed: boolean
  created_at: string
}

interface AdminClientProps {
  initialMembers: Member[]
}

export default function AdminClient({ initialMembers }: AdminClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [wilayahFilter, setWilayahFilter] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const wilayahList = Array.from(new Set(members.map((m) => m.wilayah))).sort()

  const filteredMembers = members.filter((m) => {
    const s = search.toLowerCase()
    const matchesSearch =
      m.nama_lengkap.toLowerCase().includes(s) ||
      m.email.toLowerCase().includes(s) ||
      m.unique_number.includes(s)
    const matchesWilayah = !wilayahFilter || m.wilayah === wilayahFilter
    return matchesSearch && matchesWilayah
  })

  async function handleToggleRedeemed(id: string, currentStatus: boolean) {
    if (togglingId) return
    setTogglingId(id)
    const newStatus = !currentStatus
    
    // Optimistic update
    setMembers(prev => prev.map(m => m.id === id ? { ...m, is_redeemed: newStatus } : m))
    
    const res = await toggleRedemptionStatus(id, newStatus)
    if (!res.success) {
      alert(res.error || 'Gagal memperbarui status')
      // Rollback
      setMembers(prev => prev.map(m => m.id === id ? { ...m, is_redeemed: currentStatus } : m))
    }
    setTogglingId(null)
  }

  function exportCSV() {
    const headers = ['Nama', 'Email', 'Wilayah', 'Nomor Unik', 'Nomor WA', 'Tgl Lahir', 'Status Tukar', 'Terdaftar']
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map((m) =>
        [
          `"${m.nama_lengkap}"`,
          m.email,
          m.wilayah,
          m.unique_number,
          m.nomor_telepon,
          m.tanggal_lahir,
          m.is_redeemed ? 'SUDAH' : 'BELUM',
          new Date(m.created_at).toLocaleString(),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pendataan_omkygp_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
      {/* Table Header / Controls */}
      <div className="p-8 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Cari nama, email, kode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-brand-green outline-none transition-all font-bold text-sm"
              />
            </div>
            <select
              value={wilayahFilter}
              onChange={(e) => setWilayahFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-brand-green outline-none transition-all bg-white font-bold text-sm cursor-pointer"
            >
              <option value="">Semua Wilayah</option>
              {wilayahList.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <Button onClick={exportCSV} className="whitespace-nowrap h-[48px] px-8">
            📥 Download CSV
          </Button>
        </div>
        <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
           Menampilkan {filteredMembers.length} dari {members.length} Anggota
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nomor Unik</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Wilayah</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Tukar</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kontak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-5">
                  <span className="px-4 py-1.5 bg-brand-purple/10 text-brand-purple font-black rounded-xl text-lg font-mono">
                    {m.unique_number}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-gray-900">{m.nama_lengkap}</div>
                  <div className="text-xs text-gray-400 font-medium">{m.email}</div>
                </td>
                <td className="px-6 py-5">
                   <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                     {m.wilayah}
                   </span>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => handleToggleRedeemed(m.id, m.is_redeemed)}
                    disabled={togglingId === m.id}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
                      ${m.is_redeemed 
                        ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
                        : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200 hover:text-gray-600'
                      }
                      ${togglingId === m.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                    `}
                  >
                    {togglingId === m.id ? (
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${m.is_redeemed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                    {m.is_redeemed ? 'SUDAH TUKAR' : 'BELUM TUKAR'}
                  </button>
                </td>
                <td className="px-6 py-5">
                   <div className="text-sm font-bold text-gray-700">{m.nomor_telepon}</div>
                   <div className="text-[10px] text-gray-400 font-medium">
                     Join: {new Date(m.created_at).toLocaleDateString('id-ID')}
                   </div>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold">
                   Tidak ada data yang ditemukan 🔍
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
