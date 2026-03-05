"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LeafBackground } from "@/components/ui/leaf-background";
import { Phone, KeyRound, ArrowRight, UserPlus, User, MapPin } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<"details" | "otp">("details");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.phone.length < 10 || formData.name.length < 2) return;
        setIsLoading(true);
        // Simulate API call to register & send OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`register-otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`register-otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length < 6) return;

        setIsLoading(true);
        // Simulate verification API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/user/dashboard");
        }, 1500);
    };

    return (
        <LeafBackground className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-green-800/20 bg-green-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

                    <CardHeader className="space-y-1 text-center pb-6 pt-10">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">Join Our Initiative</CardTitle>
                        <CardDescription className="text-green-100/70 text-base">
                            {step === "details" ? "Create your resident account for waste collection services." : "Verify your mobile number to complete registration."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <AnimatePresence mode="wait">
                            {step === "details" ? (
                                <motion.form
                                    key="details-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleDetailsSubmit}
                                    className="space-y-5"
                                >
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
                                            <Label htmlFor="address" className="text-green-50 font-medium">House Address/Ward Details (Optional)</Label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-3 pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-green-400/70" />
                                                </div>
                                                <textarea
                                                    id="address"
                                                    placeholder="House No, Street, Ward..."
                                                    rows={3}
                                                    className="w-full rounded-md px-3 py-2 text-sm pl-10 bg-green-950/50 border border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 h-12 text-lg font-medium transition-all group"
                                        disabled={isLoading || formData.phone.length < 10 || formData.name.length < 2}
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Continue <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="otp-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleRegister}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <Label className="text-green-50 font-medium">Enter 6-digit OTP</Label>
                                            <button
                                                type="button"
                                                onClick={() => setStep("details")}
                                                className="text-xs text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                Edit Details
                                            </button>
                                        </div>
                                        <p className="text-sm text-green-100/60 mb-4">
                                            Sent to +91 {formData.phone}
                                        </p>

                                        <div className="flex justify-between gap-2">
                                            {otp.map((digit, index) => (
                                                <Input
                                                    key={index}
                                                    id={`register-otp-${index}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-xl font-bold bg-green-950/50 border-green-800/50 text-white focus-visible:ring-green-400 focus-visible:border-green-400"
                                                    disabled={isLoading}
                                                    autoFocus={index === 0}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 h-12 text-lg font-medium transition-all"
                                        disabled={isLoading || otp.join("").length < 6}
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Verify & Register <KeyRound className="ml-2 h-5 w-5" /></>
                                        )}
                                    </Button>

                                    <div className="text-center mt-4">
                                        <p className="text-sm text-green-100/60">
                                            Didn&apos;t receive the code?{" "}
                                            <button type="button" className="text-green-400 font-medium hover:text-green-300 transition-colors">
                                                Resend OTP
                                            </button>
                                        </p>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pb-8 pt-4 border-t border-green-800/30 mt-4">
                        <div className="text-center text-sm text-green-100/60 w-full">
                            Already have an account?{" "}
                            <Link href="/login" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                                Log in here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </LeafBackground>
    );
}
