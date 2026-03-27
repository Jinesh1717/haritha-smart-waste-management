"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LeafBackground } from "@/components/ui/leaf-background";
import { Briefcase, KeyRound, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginWithEmail, logoutUser } from "@/services/auth";
import { getUserProfile } from "@/services/firestore";

export default function StaffLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);
        setErrorMsg("");

        try {
            // 1. Authenticate with Firebase
            const { user, error: authError } = await loginWithEmail(email, password);
            
            if (authError || !user) {
                setErrorMsg(authError || "Failed to log in. Please check your credentials.");
                setIsLoading(false);
                return;
            }

            // 2. Fetch user profile from Firestore to confirm collector role and status
            const userProfile = await getUserProfile(user.uid);

            if (!userProfile) {
                await logoutUser();
                setErrorMsg("User profile not found. Please register first.");
                return;
            }

            if (userProfile.role !== "collector") {
                await logoutUser();
                setErrorMsg("Access Denied. You do not have staff privileges.");
                return;
            }

            if (userProfile.status === "pending") {
                await logoutUser();
                setErrorMsg("Your account is pending admin approval. You cannot log in yet.");
                return;
            }

            // Valid, approved staff member
            router.push("/dashboard/staff");
            
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMsg("An unexpected error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LeafBackground className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

                    <CardHeader className="space-y-1 text-center pb-8 pt-10">
                        <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                            <Briefcase className="w-8 h-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-emerald-950 mb-2 font-serif">Staff Portal</CardTitle>
                        <CardDescription className="text-slate-500 text-base">
                            Enter your credentials to access the staff dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                {errorMsg && (
                                    <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-md text-center">
                                        {errorMsg}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-emerald-900 font-medium">Staff Email</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-emerald-600/50" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your registered email"
                                            className="pl-10 bg-white/50 border-emerald-200 text-emerald-950 placeholder:text-slate-500/50 focus-visible:ring-emerald-400 h-12"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-emerald-900 font-medium">Password</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-emerald-600/50" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 bg-white/50 border-emerald-200 text-emerald-950 placeholder:text-slate-500/50 focus-visible:ring-emerald-400 h-12"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-200/50 h-12 text-lg font-medium transition-all"
                                disabled={isLoading || !email || !password}
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pb-8 pt-4 border-t border-white/60 mt-6 bg-white/20">
                        <Link href="/" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                            &larr; Back to Portal Selection
                        </Link>
                        <div className="text-sm text-slate-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register/staff" className="font-semibold text-emerald-600 hover:text-emerald-700">
                                Apply Here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </LeafBackground>
    );
}
