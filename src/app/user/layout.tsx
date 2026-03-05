"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Trash2,
    History,
    CreditCard,
    Bell,
    User,
    LogOut,
    Menu,
    X,
    Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
    { href: "/user/dashboard", label: "Dashboard", icon: Home },
    { href: "/user/waste/add", label: "Add Waste", icon: Trash2 },
    { href: "/user/waste/history", label: "History", icon: History },
    { href: "/user/payments", label: "Payments", icon: CreditCard },
    { href: "/user/notifications", label: "Notifications", icon: Bell },
    { href: "/user/profile", label: "Profile", icon: User },
];

const NavLinks = ({ onClick, pathname }: { onClick?: () => void, pathname: string }) => (
    <div className="space-y-2">
        {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClick}
                    className={cn(
                        "relative px-4 py-3.5 rounded-2xl transition-colors overflow-hidden group block flex items-center gap-3 font-bold",
                        isActive
                            ? "text-emerald-900"
                            : "text-slate-500 hover:text-emerald-800 hover:bg-white/40"
                    )}
                >
                    {isActive && (
                        <motion.div
                            layoutId="activeTabSidebarUser"
                            className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-2xl -z-10 border border-white/60 shadow-sm"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                    )}
                    <Icon className={cn(
                        "h-5 w-5 transition-transform duration-300 relative z-10",
                        isActive ? "text-emerald-600 scale-110" : "text-slate-400 group-hover:scale-110 group-hover:text-emerald-500"
                    )} />
                    <span className="relative z-10">{link.label}</span>
                </Link>
            );
        })}
    </div>
);

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="relative flex w-full text-slate-800 font-sans min-h-[100dvh] overflow-hidden">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 border-r border-white/40 bg-white/40 backdrop-blur-xl relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="p-6 border-b border-white/40 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-emerald-950 font-serif tracking-tight leading-tight">
                            Haritha Karma
                        </h1>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Resident Portal</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <NavLinks pathname={pathname} />
                </nav>

                <div className="p-4 border-t border-white/40">
                    <Link href="/login" className="w-full">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 h-12 font-bold"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-20 min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/40 bg-white/60 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-emerald-950">Resident</span>
                    </div>

                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-emerald-950 hover:bg-white/50 -mr-2">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0 bg-white/60 backdrop-blur-xl border-white/60">
                            <div className="flex flex-col h-full bg-white/80">
                                <div className="p-6 border-b border-white/40 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mx-auto">
                                            <Leaf className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-emerald-950">Haritha Karma</h2>
                                        </div>
                                    </div>
                                </div>
                                <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    <NavLinks onClick={() => setIsMobileOpen(false)} pathname={pathname} />
                                </nav>
                                <div className="p-4 border-t border-white/40">
                                    <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold"
                                        >
                                            <LogOut className="mr-3 h-5 w-5" />
                                            Sign Out
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto custom-scrollbar p-6 md:p-10 container max-w-7xl mx-auto">
                    <div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] min-h-full overflow-hidden p-6 max-w-6xl mx-auto">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
