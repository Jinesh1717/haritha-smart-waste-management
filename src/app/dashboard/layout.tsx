"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";

const links = [
    { name: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Wards", href: "/dashboard/wards", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { name: "Staff", href: "/dashboard/staff", icon: "M17 20h5V10a2 2 0 00-2-2h-3m-9 8v-2a2 2 0 012-2h4a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-2a2 2 0 01-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm-3-12a3 3 0 110-6 3 3 0 010 6z" },
    { name: "Attendance", href: "/dashboard/attendance", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Billing", href: "/dashboard/billing", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" },
];

function NavLinks({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
    return (
        <nav className="flex flex-col gap-2 p-6 text-[15px] font-bold">
            <AnimatePresence>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={onClick}
                            className="relative px-4 py-3.5 rounded-2xl transition-colors overflow-hidden group block"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabSidebar"
                                    className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-2xl -z-10 border border-white/60 shadow-sm"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative z-10 flex items-center gap-3 ${isActive ? 'text-emerald-900' : 'text-slate-500 hover:text-emerald-800'}`}
                            >
                                <svg className={`h-6 w-6 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={link.icon} />
                                </svg>
                                {link.name}
                            </motion.div>
                        </Link>
                    );
                })}
            </AnimatePresence>
        </nav>
    );
}

function SidebarFooter({ onClick }: { onClick?: () => void }) {
    const router = useRouter();

    const handleLogout = async () => {
        await logoutUser();
        if (onClick) onClick();
        router.push("/login/admin");
    };

    return (
        <div className="mt-auto p-6 space-y-3">
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
            </button>
            <Link
                href="/dashboard/settings"
                onClick={onClick}
                className="flex items-center gap-4 bg-white/50 hover:bg-white/70 transition-colors backdrop-blur-md border border-white/60 p-4 rounded-3xl shadow-sm group"
            >
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">Admin User</p>
                    <p className="text-[11px] font-bold text-emerald-600/70 uppercase tracking-wider">System Core</p>
                </div>
            </Link>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
        <div className="flex flex-col h-full">
            <div className="flex h-24 items-center border-b border-white/40 px-8">
                <motion.div
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex items-center gap-4"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg border-2 border-white">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-emerald-950 font-serif tracking-tight leading-tight">Haritha Karma Portal</span>
                        <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Admin Dashboard</span>
                    </div>
                </motion.div>
            </div>

            <NavLinks pathname={pathname} onClick={onClose} />
            <SidebarFooter onClick={onClose} />
        </div>
    );

    return (
        <div className="relative flex w-full text-slate-800 font-sans min-h-[100dvh]">

            {/* ── Desktop Sidebar ── */}
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-white/40 bg-white/40 backdrop-blur-xl sm:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <SidebarContent />
            </aside>

            {/* ── Mobile Header ── */}
            <header className="sm:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 border-b border-white/40 bg-white/60 backdrop-blur-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow border-2 border-white">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <span className="font-bold text-emerald-950 text-base">Haritha Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 rounded-xl hover:bg-white/60 transition-colors text-emerald-950"
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            {/* ── Mobile Drawer Overlay ── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        />
                        {/* Drawer */}
                        <motion.div
                            key="drawer"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="sm:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-2xl"
                        >
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/60 transition-colors text-slate-600"
                                    aria-label="Close navigation"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <SidebarContent onClose={() => setIsMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main Content Area ── */}
            <main className="flex-1 sm:pl-72 flex flex-col min-h-[100dvh]">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 p-4 pt-20 sm:pt-4 md:p-10 container max-w-7xl mx-auto"
                >
                    {/* Glassmorphism content container */}
                    <div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] min-h-[calc(100vh-80px)] overflow-hidden">
                        {children}
                    </div>
                </motion.div>
            </main>

        </div>
    )
}
