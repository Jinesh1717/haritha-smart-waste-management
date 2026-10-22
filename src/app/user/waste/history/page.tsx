"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Filter, Clock, CheckCircle2, ChevronDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getWasteRecordsForUser } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface WasteRecord {
    id: string;
    date: string;
    time: string;
    type: string;
    weight: string;
    status: string;
    agent: string;
    points: string;
}

export default function WasteHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [historyData, setHistoryData] = useState<WasteRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const records = await getWasteRecordsForUser(user.uid);
                // Map Firestore fields to UI expected fields
                const formattedRecords: WasteRecord[] = records.map((record: Record<string, unknown>) => ({
                    id: record.id as string,
                    date: record.createdAt ? new Date((record.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Unknown Date",
                    time: record.createdAt ? new Date((record.createdAt as { seconds: number }).seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "Unknown Time",
                    type: (record.category as string) || "General",
                    weight: `${record.quantity} kg`,
                    status: (record.status as string) || "Pending",
                    agent: (record.assignedStaffId as string) || "Unassigned",
                    points: record.points ? `+${record.points}` : "Pending",
                }));
                // Sort by date descending (assuming recent is first)
                setHistoryData(formattedRecords.reverse());
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const filteredHistory = historyData.filter(item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Collected":
                return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 font-normal"><CheckCircle2 className="w-3 h-3 mr-1" /> Collected</Badge>;
            case "Pending":
                return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-normal"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            default:
                return <Badge variant="outline" className="text-gray-400 border-gray-600">{status}</Badge>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-3">
                        <Calendar className="text-emerald-600" /> Collection History
                    </h1>
                    <p className="text-slate-500/70 text-base">View all your past waste collections and pending requests.</p>
                </div>

                <div className="flex items-center gap-2 bg-white/40 border border-white/60 rounded-xl p-3 shadow-lg backdrop-blur-sm">
                    <div className="text-center px-4 border-r border-emerald-200">
                        <p className="text-2xl font-bold text-emerald-600">12</p>
                        <p className="text-xs text-slate-500/60 uppercase tracking-wider">Total Pickups</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-2xl font-bold text-teal-600">45<span className="text-sm font-normal text-teal-600/70">kg</span></p>
                        <p className="text-xs text-slate-500/60 uppercase tracking-wider">Recycled</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500/50" />
                    <Input
                        placeholder="Search by ID, type, or status..."
                        className="pl-9 bg-white/40 border-white/60 text-emerald-950 placeholder:text-slate-500/40 focus-visible:ring-emerald-400 h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Input type="date" className="bg-white/40 border-white/60 text-slate-500/80 focus-visible:ring-emerald-400 h-11 w-[150px] [color-scheme:dark]" />
                    <button className="flex items-center justify-center h-11 px-4 rounded-md border border-white/60 bg-white/40 text-emerald-100 hover:bg-emerald-800/40 transition-colors">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredHistory.map((item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id}
                    >
                        <Card className="border-white/60 bg-white/40 backdrop-blur-md overflow-hidden hover:bg-green-900/40 transition-colors group cursor-pointer group">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Date section */}
                                    <div className="bg-emerald-950/60 p-4 flex flex-row sm:flex-col items-center justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-white/60 sm:w-32 shrink-0">
                                        <div className="text-center">
                                            <p className="text-xs text-emerald-600 font-semibold uppercase">{item.date.split(' ')[1]} {item.date.split(' ')[2]}</p>
                                            <p className="text-2xl font-bold text-emerald-950 leading-none mt-1">{item.date.split(' ')[0]}</p>
                                        </div>
                                        <div className="flex space-x-2 sm:hidden">
                                            {getStatusBadge(item.status)}
                                        </div>
                                    </div>

                                    {/* Details section */}
                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold text-lg text-emerald-950">{item.type}</p>
                                                    <span className="hidden sm:inline-flex">{getStatusBadge(item.status)}</span>
                                                </div>
                                                <p className="text-xs text-slate-500/50 px-2 py-0.5 bg-white/50 rounded inline-block border border-white/60">ID: {item.id}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <p className="font-bold text-teal-300 text-lg">{item.weight}</p>
                                                {item.points !== "Pending" && (
                                                    <p className="text-xs text-emerald-600 font-medium bg-emerald-950 border border-emerald-200 px-1.5 py-0.5 rounded-full mt-1">
                                                        {item.points} pts
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm mt-2 text-slate-500/70 border-t border-white/60 pt-3">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{item.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                <span>Agent: {item.agent}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center justify-center p-4 border-l border-white/60 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronDown className="w-5 h-5 text-emerald-600 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {filteredHistory.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/60 rounded-xl bg-white/40">
                        <Search className="w-12 h-12 text-emerald-800/60 mx-auto mb-3" />
                        <p className="text-slate-500/60 mb-1">No collections found</p>
                        <p className="text-sm text-slate-500/40">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
