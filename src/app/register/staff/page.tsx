"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LeafBackground } from "@/components/ui/leaf-background";
import { Phone, ArrowRight, UserPlus, User, MapPin, KeyRound } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { registerWithEmail, logoutUser } from "@/services/auth";
import { createUserProfile } from "@/services/firestore";

export default function StaffRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        ward: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }
        
        setIsLoading(true);

        try {
            // 1. Create the user in Firebase Auth
            const { user, error: authError } = await registerWithEmail(formData.email, formData.password);
            
            if (authError || !user) {
                setErrorMsg(authError || "Failed to register new account.");
                setIsLoading(false);
                return;
            }

            // 2. Create the Firestore profile with pending status
            await createUserProfile(user.uid, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                ward: formData.ward,
                role: "collector",
                status: "pending" // Admin must change this to 'approved'
            });

            // 3. Log them out immediately (they shouldn't be logged in while pending)
            await logoutUser();
            
            setSuccess(true);
        } catch (error) {
            console.error("Registration Error:", error);
            setErrorMsg("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <LeafBackground className="min-h-screen flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <Card className="border-green-800/20 bg-green-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center p-8">
                        <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <span className="text-3xl text-white">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Registration Submitted!</h2>
                        <p className="text-green-100/70 mb-8">
                            Your account has been created and is awaiting administrator approval. You will not be able to log in until your account is approved.
                        </p>
                        <Link href="/login/staff">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                                Return to Staff Login
                            </Button>
                        </Link>
                    </Card>
                </motion.div>
            </LeafBackground>
        )
    }

    return (
        <LeafBackground className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md my-8"
            >
                <Card className="border-green-800/20 bg-green-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

                    <CardHeader className="space-y-1 text-center pb-6 pt-10">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">Staff Registration</CardTitle>
                        <CardDescription className="text-green-100/70 text-base">
                            Apply for a Collector account. Requires Admin approval.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-5">
                            {errorMsg && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-md text-center">
                                    {errorMsg}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-green-50 font-medium">Full Name</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-green-400/70" />
                                        </div>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10 bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-11"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={isLoading}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-green-50 font-medium">Email Address</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-green-400/70" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="staff@harithakarmasena.com"
                                            className="pl-10 bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-11"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-green-50 font-medium">Mobile Number</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-green-400/70" />
                                            <span className="ml-2 text-green-100/70 border-r border-green-700/50 pr-2">+91</span>
                                        </div>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="000 000 0000"
                                            className="pl-[5.5rem] bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-11"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ward" className="text-green-50 font-medium">Assigned Ward (Optional)</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-green-400/70" />
                                        </div>
                                        <Input
                                            id="ward"
                                            placeholder="Ward 5"
                                            className="pl-10 bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-11"
                                            value={formData.ward}
                                            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-green-50 font-medium">Password</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-green-400/70" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-11"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-green-50 font-medium">Confirm Password</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-green-400/70" />
                                        </div>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-11"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 h-12 text-lg font-medium transition-all group mt-6"
                                disabled={isLoading || !formData.name || !formData.phone || !formData.password || !formData.confirmPassword}
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Apply for Account <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pb-8 pt-4 border-t border-green-800/30 mt-4">
                        <div className="text-center text-sm text-green-100/60 w-full">
                            Already have an approved account?{" "}
                            <Link href="/login/staff" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                                Log in here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </LeafBackground>
    );
}
