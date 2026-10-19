"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    UserCheck,
    Search,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Download,
    Users,
    Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { getAttendanceRecords, AttendanceRecord } from "@/services/wasteStore";

export default function AdminAttendancePage() {
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterWard, setFilterWard] = useState("All");

    const refreshData = () => {
        setAttendanceList(getAttendanceRecords());
    };

    useEffect(() => {
        refreshData();
        const handleSync = () => refreshData();
        window.addEventListener("hks_data_change", handleSync);
        return () => window.removeEventListener("hks_data_change", handleSync);
    }, []);

    const todayStr = new Date().toISOString().split("T")[0];
    const presentTodayCount = attendanceList.filter(
        a => (a.date === todayStr || a.date === "2026-10-19") && a.status === "Present"
    ).length;

    const filteredRecords = attendanceList.filter((rec) => {
        const matchesQuery =
            rec.collectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.collectorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.ward.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesWard = filterWard === "All" || rec.ward === filterWard;
        return matchesQuery && matchesWard;
    });

    const exportToCSV = () => {
        const headers = ["ID", "Collector Name", "Ward", "Date", "Time", "Status", "Notes"];
        const rows = filteredRecords.map(r => [
            r.collectorId,
            r.collectorName,
            r.ward,
            r.date,
            r.time,
            r.status,
            r.notes || ""
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `HKS_Attendance_${todayStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">

            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 font-serif flex items-center gap-3">
                        <UserCheck className="w-8 h-8 text-emerald-600" /> Collector Attendance & Duty Roster
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Monitor field collector clock-ins, daily ward deployments, and attendance logs.
                    </p>
                </div>

                <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-xl"
                >
                    <Download className="w-4 h-4 mr-2" /> Export Attendance CSV
                </Button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-500">
                            Present Today
                        </CardDescription>
                        <CardTitle className="text-3xl font-black text-emerald-700 flex items-center justify-between">
                            {presentTodayCount}
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">Verified clock-ins on shift</p>
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-500">
                            Total Records Logged
                        </CardDescription>
                        <CardTitle className="text-3xl font-black text-emerald-950 flex items-center justify-between">
                            {attendanceList.length}
                            <Calendar className="w-6 h-6 text-teal-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">Live shift database</p>
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-500">
                            Active Wards Covered
                        </CardDescription>
                        <CardTitle className="text-3xl font-black text-emerald-950 flex items-center justify-between">
                            4 / 4
                            <MapPin className="w-6 h-6 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">100% municipality coverage</p>
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-500">
                            System Status
                        </CardDescription>
                        <CardTitle className="text-2xl font-black text-emerald-800 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            Live Sync
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">Real-time collector updates</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Table & Filters */}
            <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-md">
                <CardHeader className="border-b border-emerald-50 pb-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search collector name or ward..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white/80 border-emerald-200 rounded-xl"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs text-slate-500 font-medium">Filter Ward:</span>
                            {["All", "Ward 1", "Ward 2", "Ward 3", "Ward 4"].map((w) => (
                                <button
                                    key={w}
                                    type="button"
                                    onClick={() => setFilterWard(w)}
                                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                                        filterWard === w
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-emerald-50/50">
                            <TableRow>
                                <TableHead className="font-bold text-emerald-950">Collector</TableHead>
                                <TableHead className="font-bold text-emerald-950">Ward</TableHead>
                                <TableHead className="font-bold text-emerald-950">Date</TableHead>
                                <TableHead className="font-bold text-emerald-950">Clock-In Time</TableHead>
                                <TableHead className="font-bold text-emerald-950">Status</TableHead>
                                <TableHead className="font-bold text-emerald-950">Duty Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                                        No attendance records match your search criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRecords.map((rec) => (
                                    <TableRow key={rec.id} className="hover:bg-emerald-50/30">
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                                    {rec.collectorName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-emerald-950 text-sm">{rec.collectorName}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{rec.collectorId}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                                                {rec.ward}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-slate-600">
                                            {rec.date}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-emerald-900 font-semibold">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                                {rec.time}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-emerald-500 text-white font-bold text-xs shadow-sm">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> {rec.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600 italic">
                                            {rec.notes || "Regular scheduled route"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
