'use client'

import { useState } from 'react'
import { UpdateMemberData, updateMember } from '@/app/actions/members'
import { Input, Select, TextArea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { UniqueNumberCard } from '@/components/UniqueNumberCard'

const WILAYAH_OPTIONS = [
  'Tidak / Belum Tahu', 'Edmund 1', 'Edmund 2', 'Edmund 3',
  'Felisitas 1', 'Felisitas 2',
  'Fransiskus Xaverius 1', 'Fransiskus Xaverius 2',
  'Hieronimus 1', 'Hieronimus 2',
  'Maria Medali Wasiat 1', 'Maria Medali Wasiat 2',
  'Maria Ratu Rosari 1', 'Maria Ratu Rosari 2',
  'Veronica 1', 'Veronica 2',
].map((w) => ({ value: w, label: w }))

const STATUS_PENDIDIKAN_OPTIONS = [
  { value: 'SMA/SMK/Sederajat', label: 'Sekolah (SMA/SMK/Sederajat)' },
  { value: 'Kuliah', label: 'Kuliah' },
  { value: 'Lulus Kuliah', label: 'Lulus Kuliah' },
  { value: 'Kerja', label: 'Kerja' },
]

const KELAS_OPTIONS = [
  { value: '10', label: 'Kelas 10' },
  { value: '11', label: 'Kelas 11' },
  { value: '12', label: 'Kelas 12' },
]

interface DashboardContentProps {
  member: any
  isAdmin: boolean
}

export function DashboardContent({ member, isAdmin }: DashboardContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form State
  const [form, setForm] = useState<UpdateMemberData>({
    nama_lengkap: member.nama_lengkap,
    alamat_ktp: member.alamat_ktp || '',
    alamat_domisili: member.alamat_domisili || '',
    nomor_telepon: member.nomor_telepon,
    wilayah: member.wilayah,
    tanggal_lahir: member.tanggal_lahir,
    is_stasi_ygp: member.is_stasi_ygp ?? true,
    asal_paroki_stasi: member.asal_paroki_stasi || '',
    status_pendidikan: member.status_pendidikan || '',
    kelas_sekolah: member.kelas_sekolah || '',
    nama_sekolah_kampus: member.nama_sekolah_kampus || '',
  })

  async function handleSave() {
    setError('')
    setLoading(true)
    
    // Cleanup irrelevant data before saving
    const finalForm = { ...form }
    if (form.status_pendidikan === 'Lulus Kuliah' || form.status_pendidikan === 'Kerja') {
      finalForm.kelas_sekolah = ''
      finalForm.nama_sekolah_kampus = ''
    } else if (form.status_pendidikan === 'Kuliah') {
      finalForm.kelas_sekolah = ''
    }
    if (form.is_stasi_ygp) {
      finalForm.asal_paroki_stasi = ''
    }

    const res = await updateMember(member.email, finalForm)
    setLoading(false)
    
    if (res.success) {
      setIsEditing(false)
      window.location.reload()
    } else {
      setError(res.error || 'Terjadi kesalahan')
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-10 animate-pop">
        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-brand-green/20 p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-green" />
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Edit Profil Kamu ✨</h2>
            <button 
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-sm uppercase tracking-widest"
            >
              Batal
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {error && (
              <div className="md:col-span-2 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <div className="md:col-span-2">
              <Input
                label="Nama Lengkap"
                required
                value={form.nama_lengkap}
                onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              />
            </div>

            <TextArea
              label="Alamat KTP"
              required
              value={form.alamat_ktp}
              onChange={(e) => setForm({ ...form, alamat_ktp: e.target.value })}
            />
            <TextArea
              label="Alamat Domisili"
              required
              value={form.alamat_domisili}
              onChange={(e) => setForm({ ...form, alamat_domisili: e.target.value })}
            />

            <Input
              label="Nomor WhatsApp"
              required
              value={form.nomor_telepon}
              onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
            />
            <Select
              label="Wilayah / Lingkungan"
              required
              value={form.wilayah}
              onChange={(e) => setForm({ ...form, wilayah: e.target.value })}
              options={WILAYAH_OPTIONS}
            />

            <Input
              label="Tanggal Lahir"
              type="date"
              required
              value={form.tanggal_lahir}
              onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
            />

            <Select
              label="Asal Paroki / Stasi dari Stasi YGP?"
              required
              value={form.is_stasi_ygp ? 'Ya' : 'Tidak'}
              onChange={(e) => setForm({ ...form, is_stasi_ygp: e.target.value === 'Ya' })}
              options={[{ value: 'Ya', label: 'Ya' }, { value: 'Tidak', label: 'Tidak' }]}
            />

            {!form.is_stasi_ygp && (
              <Input
                label="Asal Paroki / Stasi"
                value={form.asal_paroki_stasi}
                onChange={(e) => setForm({ ...form, asal_paroki_stasi: e.target.value })}
              />
            )}

            <Select
              label="Status"
              required
              value={form.status_pendidikan}
              onChange={(e) => setForm({ ...form, status_pendidikan: e.target.value })}
              options={STATUS_PENDIDIKAN_OPTIONS}
            />

            {form.status_pendidikan === 'SMA/SMK/Sederajat' && (
              <>
                <Select
                  label="Kelas"
                  value={form.kelas_sekolah}
                  onChange={(e) => setForm({ ...form, kelas_sekolah: e.target.value })}
                  options={KELAS_OPTIONS}
                />
                <Input
                  label="Nama Sekolah"
                  value={form.nama_sekolah_kampus}
                  onChange={(e) => setForm({ ...form, nama_sekolah_kampus: e.target.value })}
                />
              </>
            )}

            {form.status_pendidikan === 'Kuliah' && (
              <Input
                label="Nama Kampus"
                value={form.nama_sekolah_kampus}
                onChange={(e) => setForm({ ...form, nama_sekolah_kampus: e.target.value })}
              />
            )}

            <div className="md:col-span-2 pt-6">
              <Button type="submit" loading={loading} className="w-full py-4 text-lg">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  
  const showSchoolInfo = (member.status_pendidikan === 'SMA/SMK/Sederajat' || member.status_pendidikan === 'Kuliah')

  const profileData = [
    { label: 'Nama Lengkap', value: member.nama_lengkap, icon: '👤', color: '#00a54d', bg: '#f0fdf4' },
    { label: 'Email Terdaftar', value: member.email, icon: '✉️', color: '#902681', bg: '#fef2f2', isEmail: true },
    { label: 'Wilayah / Lingkungan', value: member.wilayah, icon: '📍', color: '#d12027', bg: '#fdf2f2' },
    { label: 'Nomor WhatsApp', value: member.nomor_telepon, icon: '📱', color: '#00a54d', bg: '#f0fdf4' },
    { 
      label: 'Berasal dari Stasi YGP', 
      value: member.is_stasi_ygp ? 'Ya' : `Tidak (${member.asal_paroki_stasi || '-'})`, 
      icon: '⛪', color: '#902681', bg: '#f5eaf9' 
    },
    { 
      label: 'Status', 
      value: member.status_pendidikan ? `${member.status_pendidikan}${member.kelas_sekolah && showSchoolInfo ? ` (Kelas ${member.kelas_sekolah})` : ''}` : '-', 
      icon: '🎓', color: '#d12027', bg: '#fdf2f2' 
    },
  ]

  // Only add school/campus if status is student or university
  if (showSchoolInfo) {
    profileData.push({ 
      label: 'Sekolah / Kampus', 
      value: member.nama_sekolah_kampus || '-', 
      icon: '🏫', color: '#00a54d', bg: '#f0fdf4' 
    })
  }

  // Add Birthday at the end
  profileData.push({
    label: 'Ulang Tahun',
    value: new Date(member.tanggal_lahir).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    icon: '🎂', color: '#902681', bg: '#fef2f2'
  })

  return (
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
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #d12027, #00a54d, #902681)' }} />

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Profil Member ✨</h2>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-green hover:text-white transition-all shadow-sm"
            >
              Edit Profil
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profileData.map(({ label, value, icon, color, bg, isEmail }) => (
              <div key={label} className="flex items-center gap-5 p-5 rounded-[2rem] transition-all hover:scale-[1.02] duration-300 overflow-hidden"
                style={{ background: bg, border: `1px solid ${color}15` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                  style={{ background: 'white', color }}>
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: `${color}cc` }}>{label}</p>
                  <p className={`text-gray-900 font-black tracking-tight leading-snug break-words ${isEmail ? 'text-[10px] sm:text-xs' : 'text-sm'}`} title={value}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 flex flex-col">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] mb-4">🏠 Alamat KTP</h2>
            <p className="text-gray-700 font-bold leading-relaxed">{member.alamat_ktp || '-'}</p>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 flex flex-col">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] mb-4">📍 Alamat Domisili</h2>
            <p className="text-gray-700 font-bold leading-relaxed">{member.alamat_domisili || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
