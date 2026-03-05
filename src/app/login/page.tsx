"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LeafBackground } from "@/components/ui/leaf-background";
import { Phone, KeyRound, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    useEffect(() => {
        // Initialize RecaptchaVerifier
        const win = window as unknown as Record<string, unknown>;
        if (!win.recaptchaVerifier) {
            win.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
    }, []);

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (phone.length < 10) return;
        setIsLoading(true);

        try {
            const formattedPhone = `+91${phone}`; // Ensure E.164 format
            const appVerifier = (window as unknown as Record<string, unknown>).recaptchaVerifier as import("firebase/auth").ApplicationVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep("otp");
        } catch (err: Error | unknown) {
            setError(err instanceof Error ? err.message : "Failed to send OTP.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const otpValue = otp.join("");
        if (otpValue.length < 6 || !confirmationResult) return;

        setIsLoading(true);
        try {
            await confirmationResult.confirm(otpValue);
            router.push("/user/dashboard");
        } catch (err: Error | unknown) {
            setError(err instanceof Error ? err.message : "Invalid OTP.");
            console.error(err);
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
                className="w-full max-w-md"
            >
                <Card className="border-green-800/20 bg-green-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

                    <CardHeader className="space-y-1 text-center pb-8 pt-10">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                            <Smartphone className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</CardTitle>
                        <CardDescription className="text-green-100/70 text-base">
                            {step === "phone" ? "Enter your mobile number to sign in" : "Enter the 6-digit OTP sent to your phone"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <AnimatePresence mode="wait">
                            {step === "phone" ? (
                                <motion.form
                                    key="phone-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handlePhoneSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
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
                                                className="pl-[5.5rem] bg-green-950/50 border-green-800/50 text-white placeholder:text-green-100/30 focus-visible:ring-green-400 h-12 text-lg"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                disabled={isLoading}
                                                autoFocus
                                            />
                                        </div>
                                        {error && (
                                            <div className="text-red-400 text-sm text-center mb-2">{error}</div>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 h-12 text-lg font-medium transition-all"
                                        disabled={isLoading || phone.length < 10}
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Get OTP <ArrowRight className="ml-2 h-5 w-5" /></>
                                        )}
                                    </Button>
                                    <div id="recaptcha-container"></div>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="otp-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleLogin}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-green-50 font-medium">One Time Password</Label>
                                            <button
                                                type="button"
                                                onClick={() => setStep("phone")}
                                                className="text-xs text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                Change Number
                                            </button>
                                        </div>

                                        <div className="flex justify-between gap-2">
                                            {otp.map((digit, index) => (
                                                <Input
                                                    key={index}
                                                    id={`otp-${index}`}
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

                                    {error && (
                                        <div className="text-red-400 text-sm text-center mt-2">{error}</div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 h-12 text-lg font-medium transition-all"
                                        disabled={isLoading || otp.join("").length < 6}
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Verify & Sign In <KeyRound className="ml-2 h-5 w-5" /></>
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

                    <CardFooter className="flex flex-col space-y-4 pb-8 pt-4 border-t border-green-800/30 mt-6">
                        <div className="text-center text-sm text-green-100/60 w-full">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                                Register now
                            </Link>
                        </div>
                        <div className="text-center text-xs text-green-100/40 w-full">
                            By proceeding, you agree to Haritha Karma Sena&apos;s <br />
                            <Link href="#" className="underline hover:text-green-200">Terms of Service</Link> & <Link href="#" className="underline hover:text-green-200">Privacy Policy</Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </LeafBackground>
    );
}
