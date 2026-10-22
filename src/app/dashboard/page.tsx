export default function DashboardHome() {
    return (
        <div className="p-8 text-slate-800">
            <h1 className="text-3xl font-extrabold tracking-tight mb-8 font-serif text-emerald-950">System Overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:bg-white/60 transition-all hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Total Wards</h3>
                    <div className="mt-4 text-5xl font-black text-emerald-900 drop-shadow-sm">12</div>
                </div>

                <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:bg-white/60 transition-all hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Active Staff</h3>
                    <div className="mt-4 text-5xl font-black text-emerald-900 drop-shadow-sm">48</div>
                </div>

                <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:bg-white/60 transition-all hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Collections</h3>
                    <div className="mt-4 text-5xl font-black text-emerald-900 drop-shadow-sm">2,450</div>
                </div>

                <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:bg-white/60 transition-all hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Monthly Revenue</h3>
                    <div className="mt-4 text-5xl font-black text-emerald-600 drop-shadow-sm">₹1.2L</div>
                </div>
            </div>
        </div>
    )
}
