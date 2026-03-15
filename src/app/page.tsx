import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans"
      style={{ background: 'linear-gradient(135deg, #10002b 0%, #902681 30%, #480ca8 50%, #00a54d 85%, #001a0d 100%)' }}
    >
      {/* Dynamic Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-pulse"
          style={{ background: 'radial-gradient(circle, #902681 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-35 animate-bounce-slow"
          style={{ background: 'radial-gradient(circle, #00a54d 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-25"
          style={{ background: 'radial-gradient(circle, #d12027 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-[80px] opacity-30 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #480ca8 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src="/logo.png" alt="OMK YGP" className="h-12 w-12 object-contain drop-shadow-2xl transition-transform group-hover:scale-110" />
          <span className="text-white font-black text-xl tracking-tight drop-shadow-md">OMK YGP</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2.5 text-white text-sm font-bold transition-all border-2 border-white/20 hover:border-white rounded-2xl hover:bg-white/10 backdrop-blur-md shadow-lg"
        >
          Masuk Akun →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 border border-white/30 backdrop-blur-xl shadow-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-white text-xs font-black tracking-widest uppercase">Pendataan Anggota OMK Stasi YGP 2026</span>
        </div>

        <h1 className="text-6xl md:text-[5.5rem] font-black text-white leading-[1.1] mb-8 tracking-tighter drop-shadow-2xl">
          Rayakan Kebersamaan<br />
          <span className="italic pr-4" style={{
            background: 'linear-gradient(90deg, #00f2fe, #4facfe, #00f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            OMK YGP
          </span>
        </h1>

        <p className="text-white/80 text-lg md:text-2xl max-w-2xl mb-14 leading-relaxed font-medium">
          Wadah ekspresi, iman, dan karya pemuda Katolik<br />
          <span className="text-white font-bold underline decoration-brand-green decoration-4 underline-offset-4">Stasi Santo Yohanes Gabriel Perboyre</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/register"
            className="px-10 py-5 font-black rounded-2xl transition-all duration-300 shadow-[0_20px_50px_rgba(8,_174,_155,_0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_174,_155,_0.5)] text-white text-lg flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #00a54d, #007a38)' }}
          >
            🚀 Daftar Sekarang
          </Link>
          <Link
            href="/login"
            className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all duration-300 border-2 border-white/20 backdrop-blur-xl hover:-translate-y-1 text-lg"
          >
            Cek Nomor Unik →
          </Link>
        </div>

        {/* Fun Step Cards */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          {[
            { step: '📝', title: 'Isi Data', desc: 'Isi formulir singkat ga sampai 1 menit!', color: '#d12027', shadow: 'rgba(209,32,39,0.3)' },
            { step: '✨', title: 'Dapat Kode', desc: 'Dapatkan 3 digit kode unik spesial buat kamu.', color: '#00a54d', shadow: 'rgba(0,165,77,0.3)' },
            { step: '🎁', title: 'Redeem Gift', desc: 'Gunakan kodenya buat ambil kejutan menarik!', color: '#902681', shadow: 'rgba(144,38,129,0.3)' },
          ].map((item) => (
            <div
              key={item.title}
              className="group backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-center transition-all duration-500 hover:border-white/30 hover:-translate-y-3 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700"
                style={{ background: item.color }} />

              <div className="text-5xl mb-6 transform transition-transform group-hover:scale-125 duration-300 drop-shadow-lg">
                {item.step}
              </div>
              <h3 className="text-white font-black mb-3 text-xl tracking-tight">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed font-medium">{item.desc}</p>

              <div className="mt-6 w-12 h-1.5 rounded-full mx-auto" style={{ background: item.color }} />
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-10 text-white/40 text-sm font-bold tracking-widest uppercase">
        © 2026 OMK Yohanes Gabriel Perboyre
      </footer>
    </div>
  )
}
