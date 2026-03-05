"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Shield, Bell, Save, Camera, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");

    const [profile, setProfile] = useState({
        name: "Mahesh Kumar",
        phone: "9876543210",
        email: "mahesh.k@example.com",
        address: "123, Green Valley Apartments, Ward 5",
        ward: "Ward 5 - Central",
    });

    const [preferences, setPreferences] = useState({
        smsAlerts: true,
        emailAlerts: false,
        whatsappAlerts: true,
        pickupReminders: true,
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // Show success toast here
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Profile Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="border-white/60 bg-white/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-600/40 to-teal-800/40" />

                            <CardContent className="pt-16 pb-6 px-6 relative flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-white border-4 border-green-950 shadow-xl flex items-center justify-center relative mb-4">
                                    <span className="text-3xl font-bold text-emerald-100">MK</span>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-emerald-950 border-2 border-green-950 hover:bg-emerald-400 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-emerald-950 mb-1">{profile.name}</h2>
                                <div className="flex items-center text-emerald-600 text-sm font-medium mb-4">
                                    <Target className="w-4 h-4 mr-1" /> {profile.ward}
                                </div>

                                <div className="w-full grid grid-cols-2 gap-2 border-t border-white/60 pt-4">
                                    <div className="bg-white/50 rounded-lg p-2 border border-white/60">
                                        <p className="text-2xl font-bold text-teal-600">45</p>
                                        <p className="text-[10px] text-slate-500/60 uppercase tracking-wider">Kg Recycled</p>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-2 border border-white/60">
                                        <p className="text-2xl font-bold text-emerald-600">120</p>
                                        <p className="text-[10px] text-slate-500/60 uppercase tracking-wider">Reward Pts</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <Card className="border-white/60 bg-white/40 backdrop-blur-md hidden md:block">
                        <CardContent className="p-2">
                            <nav className="flex flex-col space-y-1">
                                <button
                                    onClick={() => setActiveTab("personal")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "personal" ? "bg-emerald-100 text-emerald-900 font-medium" : "text-slate-500/70 hover:bg-white/50"}`}
                                >
                                    <User className="w-5 h-5" /> Personal Info
                                </button>
                                <button
                                    onClick={() => setActiveTab("preferences")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "preferences" ? "bg-emerald-100 text-emerald-900 font-medium" : "text-slate-500/70 hover:bg-white/50"}`}
                                >
                                    <Bell className="w-5 h-5" /> Notifications
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "security" ? "bg-emerald-100 text-emerald-900 font-medium" : "text-slate-500/70 hover:bg-white/50"}`}
                                >
                                    <Shield className="w-5 h-5" /> Security
                                </button>
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Form Content */}
                <div className="flex-1 w-full">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="border-white/60 bg-white/40 backdrop-blur-xl">

                            {/* Mobile Tabs */}
                            <div className="md:hidden border-b border-white/60 p-2">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid grid-cols-3 bg-emerald-50">
                                        <TabsTrigger value="personal" className="data-[state=active]:bg-white/60 data-[state=active]:text-emerald-950 text-slate-500/70">Info</TabsTrigger>
                                        <TabsTrigger value="preferences" className="data-[state=active]:bg-white/60 data-[state=active]:text-emerald-950 text-slate-500/70">Alerts</TabsTrigger>
                                        <TabsTrigger value="security" className="data-[state=active]:bg-white/60 data-[state=active]:text-emerald-950 text-slate-500/70">Security</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <form onSubmit={handleSave}>
                                {activeTab === "personal" && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-xl text-emerald-950">Personal Information</CardTitle>
                                            <CardDescription className="text-slate-500/60">Update your contact details and address.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-emerald-900">Full Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 h-5 w-5 text-emerald-600/50" />
                                                        <Input
                                                            value={profile.name}
                                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                            className="pl-10 bg-white/50 border-emerald-200 text-emerald-950 focus-visible:ring-emerald-400"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-emerald-900">Mobile Number</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-emerald-600/50" />
                                                        <Input
                                                            value={profile.phone}
                                                            readOnly
                                                            className="pl-10 bg-white/80 border-white/60 text-slate-500/60 cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500/40">Contact admin to change registered number.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-emerald-900">Email Address (Optional)</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-emerald-600/50" />
                                                    <Input
                                                        type="email"
                                                        value={profile.email}
                                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                        className="pl-10 bg-white/50 border-emerald-200 text-emerald-950 focus-visible:ring-emerald-400"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-emerald-900">Home Address</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-emerald-600/50" />
                                                    <textarea
                                                        value={profile.address}
                                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                        rows={3}
                                                        className="w-full pl-10 pr-3 py-2 rounded-md bg-white/50 border border-emerald-200 text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                {activeTab === "preferences" && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-xl text-emerald-950">Notification Preferences</CardTitle>
                                            <CardDescription className="text-slate-500/60">Choose how you want to receive updates.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="bg-white/50 border border-white/60 rounded-xl p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-emerald-950">SMS Alerts</p>
                                                    <p className="text-sm text-slate-500/50">Receive OTPs and critical alerts via SMS</p>
                                                </div>
                                                <Switch
                                                    checked={preferences.smsAlerts}
                                                    onCheckedChange={(checked) => setPreferences({ ...preferences, smsAlerts: checked })}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>

                                            <div className="bg-white/50 border border-white/60 rounded-xl p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-emerald-950">WhatsApp Updates</p>
                                                    <p className="text-sm text-slate-500/50">Collection timings and agent info</p>
                                                </div>
                                                <Switch
                                                    checked={preferences.whatsappAlerts}
                                                    onCheckedChange={(checked) => setPreferences({ ...preferences, whatsappAlerts: checked })}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>

                                            <div className="bg-white/50 border border-white/60 rounded-xl p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-emerald-950">Email Newsletters</p>
                                                    <p className="text-sm text-slate-500/50">Monthly recycling reports and tips</p>
                                                </div>
                                                <Switch
                                                    checked={preferences.emailAlerts}
                                                    onCheckedChange={(checked) => setPreferences({ ...preferences, emailAlerts: checked })}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                {activeTab === "security" && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="text-xl text-emerald-950">Security Settings</CardTitle>
                                            <CardDescription className="text-slate-500/60">Manage your account security.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="p-4 border border-white/60 bg-white/40 rounded-xl space-y-4 flex flex-col items-start">
                                                <div className="flex items-center gap-3 w-full border-b border-white/60 pb-4">
                                                    <Shield className="text-emerald-600 w-8 h-8" />
                                                    <div>
                                                        <p className="font-medium text-emerald-950">Login Sessions</p>
                                                        <p className="text-sm text-slate-500/60">Manage active sessions across devices.</p>
                                                    </div>
                                                </div>
                                                <div className="w-full flex justify-between items-center text-sm py-2">
                                                    <div>
                                                        <p className="text-emerald-950">Current Session</p>
                                                        <p className="text-slate-500/50">Windows • Chrome • IP: 192.168.1.1</p>
                                                    </div>
                                                    <Badge className="bg-emerald-500/20 text-emerald-600 border-none font-normal">Active</Badge>
                                                </div>
                                                <Button variant="outline" type="button" className="w-full sm:w-auto border-red-900/50 text-red-600 hover:bg-red-950/30 hover:text-red-600">
                                                    Sign out all other sessions
                                                </Button>
                                            </div>

                                            <div className="p-4 border border-white/60 bg-red-950/10 rounded-xl">
                                                <h3 className="text-red-600 font-medium mb-1">Delete Account</h3>
                                                <p className="text-sm text-slate-500/60 mb-4">Permanently remove your account and all associated data. This action cannot be undone.</p>
                                                <Button variant="destructive" type="button" className="bg-red-600/80 hover:bg-red-600 text-emerald-950">
                                                    Delete Account
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                <CardFooter className="pt-6 border-t border-white/60 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 transition-all shadow-lg shadow-emerald-200/20 px-8"
                                    >
                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" /> Save Changes
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
