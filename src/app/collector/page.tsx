"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeafBackground } from "@/components/ui/leaf-background";
import {
    Calendar,
    Clock,
    CheckCircle2,
    Truck,
    IndianRupee,
    UserCheck,
    Send,
    PlusCircle,
    MapPin,
    Trash2,
    LogOut,
    AlertCircle,
    User
} from "lucide-react";
import { motion } from "framer-motion";
import {
    getAttendanceRecords,
    markAttendance,
    getCollectionSchedules,
    addCollectionSchedule,
    getBills,
    createBillRequest,
    AttendanceRecord,
    CollectionSchedule,
    BillInvoice
} from "@/services/wasteStore";
import { logoutUser } from "@/services/auth";

export default function CollectorPortalPage() {
    const router = useRouter();

    // Data states
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
    const [scheduleList, setScheduleList] = useState<CollectionSchedule[]>([]);
    const [billsList, setBillsList] = useState<BillInvoice[]>([]);

    // Attendance Form
    const [selectedWard, setSelectedWard] = useState("Ward 2");
    const [attendanceNotes, setAttendanceNotes] = useState("");
    const [attendanceStatusMsg, setAttendanceStatusMsg] = useState("");

    // Collection Schedule Form
    const [scheduleDate, setScheduleDate] = useState("");
    const [wasteType, setWasteType] = useState<CollectionSchedule["wasteType"]>("Non-biodegradable (Plastic)");
    const [targetHousehold, setTargetHousehold] = useState("Mahesh K. (House #42)");
    const [scheduleWard, setScheduleWard] = useState("Ward 2");
    const [scheduleNotes, setScheduleNotes] = useState("Clean and dry plastics only");
    const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState("");

    // Payment Request Form
    const [residentName, setResidentName] = useState("Mahesh K.");
    const [residentPhone, setResidentPhone] = useState("9876543210");
    const [billWard, setBillWard] = useState("Ward 2");
    const [billMonth, setBillMonth] = useState("October 2026");
    const [billAmount, setBillAmount] = useState("100");
    const [billType, setBillType] = useState("Monthly User Fee");
    const [billSuccessMsg, setBillSuccessMsg] = useState("");

    const loadAllData = () => {
        setAttendanceList(getAttendanceRecords());
        setScheduleList(getCollectionSchedules());
        setBillsList(getBills());
    };

    useEffect(() => {
        loadAllData();

        // Listen for storage updates across pages
        const handleSync = () => loadAllData();
        window.addEventListener("hks_data_change", handleSync);
        return () => window.removeEventListener("hks_data_change", handleSync);
    }, []);

    // Check if clocked in today
    const todayStr = new Date().toISOString().split("T")[0];
    const isClockedInToday = attendanceList.some(
        a => a.collectorId === "S101" && (a.date === todayStr || a.date === "2026-10-19")
    );

    const handleMarkAttendance = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        markAttendance({
            collectorId: "S101",
            collectorName: "Rahul K.",
            ward: selectedWard,
            date: todayStr,
            time: timeStr,
            status: "Present",
            notes: attendanceNotes || "Scheduled morning route"
        });

        setAttendanceStatusMsg("Attendance marked successfully as Present for today!");
        setAttendanceNotes("");
        setTimeout(() => setAttendanceStatusMsg(""), 4000);
    };

    const handleAddSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduleDate) return;

        addCollectionSchedule({
            date: scheduleDate,
            wasteType,
            ward: scheduleWard,
            household: targetHousehold || "Ward Households",
            collectorName: "Rahul K.",
            status: "Scheduled",
            notes: scheduleNotes
        });

        setScheduleSuccessMsg(`Collection scheduled for ${scheduleDate} (${wasteType})! Visible to residents.`);
        setScheduleDate("");
        setTimeout(() => setScheduleSuccessMsg(""), 4500);
    };

    const handleGenerateBill = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNum = parseFloat(billAmount);
        if (!residentName || isNaN(amountNum) || amountNum <= 0) return;

        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 15);
        const dueStr = nextMonth.toISOString().split("T")[0];

        createBillRequest({
            residentName,
            residentPhone,
            ward: billWard,
            month: billMonth,
            amount: amountNum,
            type: billType,
            dueDate: dueStr,
            collectorName: "Rahul K.",
            notes: "Collected at door-to-door visit"
        });

        setBillSuccessMsg(`Bill of ₹${amountNum} issued to ${residentName}! Resident can now pay and download the receipt.`);
        setTimeout(() => setBillSuccessMsg(""), 5000);
    };

    const handleLogout = async () => {
        await logoutUser();
        router.push("/login/staff");
    };

    return (
        <LeafBackground className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Top Header Card */}
                <Card className="border-white/60 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-400" />
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md border-2 border-white">
                                <Truck className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold text-emerald-950 font-serif">Rahul K.</h1>
                                    <Badge className="bg-emerald-600/10 text-emerald-700 border-emerald-300">
                                        Collector S101
                                    </Badge>
                                    <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                                        Ward 2 (Kavalam)
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Haritha Karma Sena Field Operations • Waste Collection, Attendance & Billing
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="border-emerald-200 text-emerald-800 hover:bg-emerald-50 font-medium"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Tabs Navigation */}
                <Tabs defaultValue="schedule" className="w-full">
                    <TabsList className="bg-white/60 backdrop-blur-md border border-white/60 p-1.5 rounded-2xl w-full grid grid-cols-3 h-auto shadow-sm">
                        <TabsTrigger
                            value="schedule"
                            className="py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold text-slate-600 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" /> Collection Dates & Waste
                        </TabsTrigger>
                        <TabsTrigger
                            value="attendance"
                            className="py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold text-slate-600 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <UserCheck className="w-4 h-4" /> Daily Attendance
                        </TabsTrigger>
                        <TabsTrigger
                            value="billing"
                            className="py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold text-slate-600 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <IndianRupee className="w-4 h-4" /> Request Payments
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: SCHEDULE COLLECTION DATES & WASTE TYPE */}
                    <TabsContent value="schedule" className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-5 gap-6">

                            {/* Schedule Form */}
                            <Card className="md:col-span-2 border-white/60 bg-white/50 backdrop-blur-xl shadow-md">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
                                        <PlusCircle className="w-4 h-4" /> New Entry
                                    </div>
                                    <CardTitle className="text-xl font-bold text-emerald-950 font-serif">
                                        Add Waste Collection Date
                                    </CardTitle>
                                    <CardDescription>
                                        Specify when you will visit and the type of waste to collect
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddSchedule} className="space-y-4">
                                        {scheduleSuccessMsg && (
                                            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>{scheduleSuccessMsg}</span>
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Collection Date</Label>
                                            <Input
                                                type="date"
                                                required
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                                className="bg-white/70 border-emerald-200 focus-visible:ring-emerald-400"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Waste Category</Label>
                                            <Select
                                                value={wasteType}
                                                onValueChange={(val) => setWasteType(val as CollectionSchedule["wasteType"])}
                                            >
                                                <SelectTrigger className="bg-white/70 border-emerald-200">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Non-biodegradable (Plastic)">Non-biodegradable (Plastic / Bottles)</SelectItem>
                                                    <SelectItem value="Biodegradable">Biodegradable (Kitchen & Organic)</SelectItem>
                                                    <SelectItem value="E-Waste">E-Waste (Electronics & Batteries)</SelectItem>
                                                    <SelectItem value="Glass & Metal">Glass, Bottles & Scrap Metal</SelectItem>
                                                    <SelectItem value="Hazardous / Medical">Hazardous / Medical Waste</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Ward</Label>
                                            <Select value={scheduleWard} onValueChange={setScheduleWard}>
                                                <SelectTrigger className="bg-white/70 border-emerald-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Ward 1">Ward 1 - North Sector</SelectItem>
                                                    <SelectItem value="Ward 2">Ward 2 - Central Kavalam</SelectItem>
                                                    <SelectItem value="Ward 3">Ward 3 - Market Zone</SelectItem>
                                                    <SelectItem value="Ward 4">Ward 4 - Riverside</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Household / Residents</Label>
                                            <Input
                                                value={targetHousehold}
                                                onChange={(e) => setTargetHousehold(e.target.value)}
                                                placeholder="e.g. Mahesh K. (House #42) or All Households"
                                                className="bg-white/70 border-emerald-200"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Instructions / Notes</Label>
                                            <Input
                                                value={scheduleNotes}
                                                onChange={(e) => setScheduleNotes(e.target.value)}
                                                placeholder="e.g. Please wash & dry plastic packets"
                                                className="bg-white/70 border-emerald-200"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-11 rounded-xl shadow-md"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" /> Schedule Waste Collection
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Scheduled List */}
                            <Card className="md:col-span-3 border-white/60 bg-white/50 backdrop-blur-xl shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-emerald-950 font-serif">
                                                Upcoming Collection Schedule
                                            </CardTitle>
                                            <CardDescription>
                                                All scheduled pickup dates announced to community residents
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                            {scheduleList.length} Active
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {scheduleList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-4 rounded-2xl bg-white/70 border border-emerald-100/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/90 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                                                    <Trash2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-emerald-950 text-base">{item.wasteType}</h3>
                                                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-0.5">
                                                        <span className="font-semibold text-emerald-900">{item.ward}</span> • {item.household}
                                                    </p>
                                                    {item.notes && (
                                                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                                                            Note: {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right sm:self-center shrink-0">
                                                <div className="text-sm font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                                    {item.date}
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1 block">Assigned: {item.collectorName}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TAB 2: DAILY ATTENDANCE */}
                    <TabsContent value="attendance" className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-5 gap-6">

                            {/* Mark Attendance Card */}
                            <Card className="md:col-span-2 border-white/60 bg-white/50 backdrop-blur-xl shadow-md">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
                                        <UserCheck className="w-4 h-4" /> Attendance Portal
                                    </div>
                                    <CardTitle className="text-xl font-bold text-emerald-950 font-serif">
                                        Mark Today&apos;s Attendance
                                    </CardTitle>
                                    <CardDescription>
                                        Check-in to record your daily duty for Haritha Karma Sena admin review
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center">
                                        <p className="text-xs text-slate-500 font-medium">Today&apos;s Status</p>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            {isClockedInToday ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-sm shadow-sm">
                                                    <CheckCircle2 className="w-4 h-4" /> Marked Present
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-sm border border-amber-300">
                                                    <AlertCircle className="w-4 h-4" /> Not Marked Yet
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-2">
                                            Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {attendanceStatusMsg && (
                                        <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>{attendanceStatusMsg}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleMarkAttendance} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Current Assigned Ward</Label>
                                            <Select value={selectedWard} onValueChange={setSelectedWard}>
                                                <SelectTrigger className="bg-white/70 border-emerald-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Ward 1">Ward 1 - North Sector</SelectItem>
                                                    <SelectItem value="Ward 2">Ward 2 - Central Kavalam</SelectItem>
                                                    <SelectItem value="Ward 3">Ward 3 - Market Zone</SelectItem>
                                                    <SelectItem value="Ward 4">Ward 4 - Riverside</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Route / Duty Notes (Optional)</Label>
                                            <Input
                                                value={attendanceNotes}
                                                onChange={(e) => setAttendanceNotes(e.target.value)}
                                                placeholder="e.g. Sector A door-to-door collection"
                                                className="bg-white/70 border-emerald-200"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-11 rounded-xl shadow-md"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Attendance (Present)
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Attendance Records Log */}
                            <Card className="md:col-span-3 border-white/60 bg-white/50 backdrop-blur-xl shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-emerald-950 font-serif">
                                                Attendance Log
                                            </CardTitle>
                                            <CardDescription>
                                                Synced in real-time with the Admin Dashboard
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                            Verified Records
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {attendanceList.map((rec) => (
                                        <div
                                            key={rec.id}
                                            className="p-3.5 rounded-xl bg-white/70 border border-emerald-100 shadow-sm flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                    <UserCheck className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-emerald-950 text-sm">{rec.collectorName}</p>
                                                    <p className="text-xs text-slate-500">
                                                        <span className="font-semibold text-emerald-800">{rec.ward}</span> • {rec.notes || "Regular Duty"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <Badge className="bg-emerald-500 text-white font-bold text-[10px]">
                                                    {rec.status}
                                                </Badge>
                                                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                                                    {rec.date} • {rec.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TAB 3: REQUEST AND GENERATE PAYMENTS */}
                    <TabsContent value="billing" className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-5 gap-6">

                            {/* Payment Generation Form */}
                            <Card className="md:col-span-2 border-white/60 bg-white/50 backdrop-blur-xl shadow-md">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
                                        <IndianRupee className="w-4 h-4" /> New Bill
                                    </div>
                                    <CardTitle className="text-xl font-bold text-emerald-950 font-serif">
                                        Request Fee from Resident
                                    </CardTitle>
                                    <CardDescription>
                                        Issue a collection charge so residents can pay online or view dues
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleGenerateBill} className="space-y-4">
                                        {billSuccessMsg && (
                                            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>{billSuccessMsg}</span>
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Resident Name</Label>
                                            <Input
                                                value={residentName}
                                                onChange={(e) => setResidentName(e.target.value)}
                                                placeholder="Resident Name"
                                                className="bg-white/70 border-emerald-200"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Resident Mobile Number</Label>
                                            <Input
                                                value={residentPhone}
                                                onChange={(e) => setResidentPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="10-digit mobile"
                                                className="bg-white/70 border-emerald-200"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-emerald-950 font-semibold text-xs">Ward</Label>
                                                <Select value={billWard} onValueChange={setBillWard}>
                                                    <SelectTrigger className="bg-white/70 border-emerald-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Ward 1">Ward 1</SelectItem>
                                                        <SelectItem value="Ward 2">Ward 2</SelectItem>
                                                        <SelectItem value="Ward 3">Ward 3</SelectItem>
                                                        <SelectItem value="Ward 4">Ward 4</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-emerald-950 font-semibold text-xs">Amount (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={billAmount}
                                                    onChange={(e) => setBillAmount(e.target.value)}
                                                    className="bg-white/70 border-emerald-200 font-bold"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Billing Period / Month</Label>
                                            <Input
                                                value={billMonth}
                                                onChange={(e) => setBillMonth(e.target.value)}
                                                placeholder="e.g. October 2026"
                                                className="bg-white/70 border-emerald-200"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-950 font-semibold text-xs">Charge Type</Label>
                                            <Select value={billType} onValueChange={setBillType}>
                                                <SelectTrigger className="bg-white/70 border-emerald-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Monthly User Fee">Monthly User Fee (Regular)</SelectItem>
                                                    <SelectItem value="Special Waste Collection Fee">Special Waste Collection Fee</SelectItem>
                                                    <SelectItem value="Bulk Plastic Segregation Fee">Bulk Plastic Segregation Fee</SelectItem>
                                                    <SelectItem value="Commercial Waste Surcharge">Commercial Waste Surcharge</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-11 rounded-xl shadow-md"
                                        >
                                            <Send className="w-4 h-4 mr-2" /> Issue Payment Request
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Generated Invoices List */}
                            <Card className="md:col-span-3 border-white/60 bg-white/50 backdrop-blur-xl shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-emerald-950 font-serif">
                                                Generated Bills & Payment Status
                                            </CardTitle>
                                            <CardDescription>
                                                Monitors resident payments and downloadable receipt status
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {billsList.map((bill) => (
                                        <div
                                            key={bill.id}
                                            className="p-3.5 rounded-xl bg-white/70 border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-emerald-950 text-sm">{bill.residentName}</span>
                                                    <span className="text-xs text-slate-500 font-mono">({bill.residentPhone})</span>
                                                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                                                        {bill.ward}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {bill.type} • Period: {bill.month}
                                                </p>
                                            </div>

                                            <div className="text-right sm:self-center shrink-0">
                                                <div className="text-base font-extrabold text-emerald-950">
                                                    ₹{bill.amount}
                                                </div>
                                                {bill.status === "Paid" ? (
                                                    <Badge className="bg-emerald-500 text-white text-[10px] mt-0.5">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Paid on {bill.paidDate}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] mt-0.5">
                                                        Pending Payment
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </LeafBackground>
    );
}
