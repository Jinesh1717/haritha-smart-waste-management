"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LeafBackground } from "@/components/ui/leaf-background";
import { Shield, KeyRound, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const router = useRouter();
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminId || !password) return;

        setIsLoading(true);
        // Simulate login API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
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
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" />

                    <CardHeader className="space-y-1 text-center pb-8 pt-10">
                        <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                            <Shield className="w-8 h-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-emerald-950 mb-2 font-serif">Admin Portal</CardTitle>
                        <CardDescription className="text-slate-500 text-base">
                            Enter your credentials to access the admin dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adminId" className="text-emerald-900 font-medium">Admin ID</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-emerald-600/50" />
                                        </div>
                                        <Input
                                            id="adminId"
                                            type="text"
                                            placeholder="Enter Admin ID"
                                            className="pl-10 bg-white/50 border-emerald-200 text-emerald-950 placeholder:text-slate-500/50 focus-visible:ring-emerald-400 h-12"
                                            value={adminId}
                                            onChange={(e) => setAdminId(e.target.value)}
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
                                disabled={isLoading || !adminId || !password}
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
                    </CardFooter>
                </Card>
            </motion.div>
        </LeafBackground>
    );
}
