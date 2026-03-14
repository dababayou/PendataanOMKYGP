import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex flex-col">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-800/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-sm">✟</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">OMK YGP</span>
        </div>
        <Link
          href="/login"
          className="text-indigo-200 hover:text-white text-sm font-medium transition-colors"
        >
          Sudah daftar? Masuk →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-indigo-200 text-xs font-medium">Pendataan Anggota Terbuka</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
          Pendataan<br />
          <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            OMK YGP
          </span>
        </h1>

        <p className="text-indigo-200 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Sistem pendataan resmi Orang Muda Katolik{' '}
          <span className="text-white font-medium">Yohanes Gabriel Palu</span>.
          Daftar dan dapatkan nomor anggota unik Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            Daftar Sekarang
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-sm"
          >
            Lihat Nomor Saya
          </Link>
        </div>

        {/* Steps */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            { step: '01', title: 'Isi Formulir', desc: 'Lengkapi data diri Anda melalui formulir pendaftaran.' },
            { step: '02', title: 'Dapat Nomor Unik', desc: 'Sistem otomatis menghasilkan nomor 3-digit unik untuk Anda.' },
            { step: '03', title: 'Login Kapan Saja', desc: 'Masuk dengan OTP email untuk melihat nomor anggota Anda.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
            >
              <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">{item.step}</span>
              <h3 className="text-white font-semibold mt-2 mb-1">{item.title}</h3>
              <p className="text-indigo-300 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-6 text-indigo-400/60 text-xs">
        © 2025 OMK Yohanes Gabriel Palu. Sistem Pendataan Anggota.
      </footer>
    </div>
  )
}
