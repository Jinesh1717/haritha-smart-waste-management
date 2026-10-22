"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Shield, Bell, Key, Save } from "lucide-react"

export default function SettingsPage() {
    const [profileData, setProfileData] = useState({
        name: "Admin User",
        email: "admin@harithakarma.gov.in",
        phone: "+91 94000 12345"
    })
    const [profileImage, setProfileImage] = useState<string | null>(null)

    useEffect(() => {
        const savedImage = localStorage.getItem("profileImage")
        if (savedImage) {
            // eslint-disable-next-line
            setProfileImage(savedImage)
        }
    }, [])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                // Also save it to local storage right away
                localStorage.setItem("profileImage", base64String);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="flex-1 p-8 pt-6 max-w-4xl mx-auto w-full text-slate-800">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight font-serif text-emerald-950">System Settings</h2>
                <p className="text-emerald-700/70 font-medium mt-1">Manage your administrator profile and core system preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-white/40 border border-white/60 p-1 backdrop-blur-md rounded-2xl">
                    <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
                        <User className="w-4 h-4 mr-2" /> Profile Reference
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
                        <Shield className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm">
                        <Bell className="w-4 h-4 mr-2" /> Notifications
                    </TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 border-4 border-white shadow-xl flex items-center justify-center text-white text-4xl overflow-hidden relative group">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="absolute w-16 h-16 opacity-50" />
                                    )}
                                    <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                        <span className="text-xs font-bold font-sans tracking-wider uppercase">Upload</span>
                                        <input
                                            type="file"
                                            id="profile-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-emerald-950 font-bold font-serif text-lg">{profileData.name}</h3>
                                    <p className="text-emerald-600/70 text-xs font-bold uppercase tracking-wider">System Core</p>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex-1 space-y-6 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-emerald-900 font-bold">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-emerald-900 font-bold">Role Designator</Label>
                                        <Input
                                            id="role"
                                            value="Super Administrator"
                                            disabled
                                            className="bg-slate-50/50 text-slate-500 border-white/60 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-emerald-900 font-bold">Email Address</Label>
                                        <Input
                                            id="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-emerald-900 font-bold">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md border border-emerald-400">
                                        <Save className="w-4 h-4 mr-2" /> Save Profile Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="focus-visible:outline-none focus-visible:ring-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 space-y-8"
                    >
                        <div>
                            <h3 className="text-xl font-serif font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5 text-emerald-600" /> Change Password
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="current" className="text-emerald-900 font-bold">Current Password</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        className="bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new" className="text-emerald-900 font-bold">New Password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        className="bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm" className="text-emerald-900 font-bold">Confirm New Password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        className="bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                    />
                                </div>
                                <Button className="mt-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md w-full sm:w-auto">
                                    Update Password
                                </Button>
                            </div>
                        </div>

                        <hr className="border-white/60" />

                        <div>
                            <h3 className="text-xl font-serif font-bold text-red-950 mb-4 flex items-center gap-2">
                                Danger Zone
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                <div>
                                    <p className="font-bold text-red-900">Sign out all other sessions</p>
                                    <p className="text-sm text-red-700/80">Forces all other devices to re-authenticate.</p>
                                </div>
                                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 rounded-xl">
                                    Revoke Sessions
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="focus-visible:outline-none focus-visible:ring-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 max-w-2xl"
                    >
                        <h3 className="text-xl font-serif font-bold text-emerald-950 mb-6">Alert Preferences</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-emerald-900">New Invoice Payments</p>
                                    <p className="text-sm text-slate-500">Receive an email when a resident pays a bill.</p>
                                </div>
                                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                            </div>
                            <hr className="border-white/60" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-emerald-900">Staff Status Changes</p>
                                    <p className="text-sm text-slate-500">Get notified when a staff member takes leave.</p>
                                </div>
                                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                            </div>
                            <hr className="border-white/60" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-emerald-900">Weekly Summary Reports</p>
                                    <p className="text-sm text-slate-500">A rollup of collection metrics sent every Monday.</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-emerald-500" />
                            </div>
                        </div>

                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
