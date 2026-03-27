"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, ArrowRight, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResidentDashboard() {
    const nextCollection = {
        date: "15 May 2026",
        type: "Non-biodegradable",
        agent: "Rahul K.",
    };

    const recentHistory = [
        { id: 1, date: "01 May 2026", type: "Biodegradable", weight: "2.5 kg", status: "Collected" },
        { id: 2, date: "15 Apr 2026", type: "Non-biodegradable", weight: "4.2 kg", status: "Collected" },
    ];

    return (
        <div className="space-y-6 text-slate-800">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 mb-2 font-serif">Welcome, Mahesh</h1>
                <p className="text-slate-500 text-base">Here&apos;s an overview of your waste management activity.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Next Collection Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:bg-white/60">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-emerald-600 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                <Clock className="w-4 h-4" /> Next Collection
                            </CardDescription>
                            <CardTitle className="text-3xl text-emerald-950 font-black">{nextCollection.date}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Type: <span className="text-emerald-900 font-medium">{nextCollection.type}</span></p>
                                <p className="text-sm text-slate-500">Agent: <span className="text-emerald-900 font-medium">{nextCollection.agent}</span></p>
                            </div>
                            <Button asChild className="w-full mt-4 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 transition-colors shadow-sm font-semibold">
                                <Link href="/user/waste/add">Request Special Pickup</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pending Dues Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:bg-white/60">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-red-500 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                <AlertCircle className="w-4 h-4" /> Pending Dues
                            </CardDescription>
                            <CardTitle className="text-4xl text-emerald-950 font-black">₹150.00</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4">Monthly fee for May 2026</p>
                            <Button asChild className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md font-semibold transition-all hover:scale-[1.02]">
                                <Link href="/user/payments">Pay Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Environmental Impact */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:bg-white/60 lg:col-span-1 md:col-span-2">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-teal-600 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                <TrendingUp className="w-4 h-4" /> Your Impact
                            </CardDescription>
                            <CardTitle className="text-4xl text-emerald-950 font-black">12.5 kg</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4">Total waste recycled this year.</p>
                            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-medium">
                                <CheckCircle className="w-5 h-5 text-emerald-500" /> You&apos;re in the top 20% of your ward!
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl text-emerald-950 font-bold font-serif">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 flex-1">
                            <Link href="/user/waste/add" className="group flex flex-col items-center justify-center p-6 bg-white/50 hover:bg-white/80 border border-white/60 rounded-2xl transition-all h-full shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-200 transition-all">
                                    <Trash2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-emerald-900 font-semibold text-center">Report Waste</span>
                            </Link>

                            <Link href="/user/notifications" className="group flex flex-col items-center justify-center p-6 bg-white/50 hover:bg-white/80 border border-white/60 rounded-2xl transition-all h-full shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-teal-200 transition-all relative">
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                    <AlertCircle className="w-6 h-6 text-teal-600" />
                                </div>
                                <span className="text-teal-900 font-semibold text-center">Alerts & Guidelines</span>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl text-emerald-950 font-bold font-serif">Recent Collections</CardTitle>
                                <CardDescription className="text-slate-500">Your last 2 waste handovers</CardDescription>
                            </div>
                            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold" asChild>
                                <Link href="/user/waste/history">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 pt-2">
                                {recentHistory.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <Trash2 className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-emerald-950 font-bold">{item.type}</p>
                                                <p className="text-sm text-slate-500 font-medium">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-700 font-black text-lg">{item.weight}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
