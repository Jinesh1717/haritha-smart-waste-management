"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Upload, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { addWasteRecord } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function AddWastePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !category || !quantity) return;

        setIsSubmitting(true);

        try {
            await addWasteRecord({
                userId: user.uid,
                category,
                quantity: parseFloat(quantity),
                notes,
                status: "Pending",
                assignedStaffId: null
            });
            setSuccess(true);
            setTimeout(() => {
                router.push("/user/dashboard");
            }, 2000);
        } catch (error) {
            console.error("Failed to add record:", error);
            setIsSubmitting(false); // only stop submitting if error occurs, otherwise let success take over
        }
    };

    if (success) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/40 p-10 rounded-3xl border border-white/60 backdrop-blur-xl flex flex-col items-center text-center max-w-md w-full shadow-2xl shadow-emerald-200/20"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-950 mb-2">Request Submitted</h2>
                    <p className="text-slate-500/70 mb-8">Your waste collection request has been successfully registered. An agent will be assigned soon.</p>
                    <Button onClick={() => router.push("/user/dashboard")} className="w-full bg-emerald-600 hover:bg-emerald-500 text-emerald-950">
                        Return to Dashboard
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-3">
                    <Trash2 className="text-emerald-600" /> Report Waste
                </h1>
                <p className="text-slate-500/70 text-base">Register a new waste bag for collection or request a bulk pickup.</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="text-xl text-emerald-950">Waste Details</CardTitle>
                            <CardDescription className="text-slate-500/60">Provide accurate information for efficient collection.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-emerald-900">Waste Category</Label>
                                    <Select required value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-white/50 border-emerald-200 text-emerald-950 focus:ring-emerald-500 h-11">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-green-950 border-emerald-800 text-emerald-900">
                                            <SelectItem value="biodegradable">Biodegradable (Wet)</SelectItem>
                                            <SelectItem value="non-biodegradable">Non-biodegradable (Dry)</SelectItem>
                                            <SelectItem value="ewaste">E-Waste</SelectItem>
                                            <SelectItem value="medical">Medical / Sanitary</SelectItem>
                                            <SelectItem value="bulk">Bulk / Furniture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-emerald-900">Estimated Weight (kg) / Quantity</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 5"
                                        className="bg-white/50 border-emerald-200 text-emerald-950 placeholder:text-slate-500/30 focus-visible:ring-emerald-400 h-11"
                                        min="0.1"
                                        step="0.1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-emerald-900">Bag Barcode / QR ID (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter ID if using smart bags"
                                        className="bg-white/50 border-emerald-200 text-emerald-950 placeholder:text-slate-500/30 focus-visible:ring-emerald-400 h-11 flex-1"
                                    />
                                    <Button type="button" variant="outline" className="border-emerald-200 bg-white/50 text-emerald-700 hover:bg-emerald-100 hover:text-slate-600 h-11 px-3">
                                        <Camera className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-emerald-900">Additional Notes</Label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special instructions for the collection agent?"
                                    className="w-full min-h-[100px] rounded-md px-3 py-2 text-sm bg-white/50 border border-emerald-200 text-emerald-950 placeholder:text-slate-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ring-offset-background"
                                />
                            </div>

                            {/* Photo Upload area */}
                            <div className="space-y-2">
                                <Label className="text-emerald-900">Upload Photo (Highly recommended for bulk waste)</Label>
                                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/40 hover:bg-white/50 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="text-emerald-600 w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mb-1">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-500/50">PNG, JPG or JPEG (max. 5MB)</p>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="pt-2 pb-6 border-t border-white/60">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 shadow-lg shadow-emerald-200/25 h-12 text-lg font-medium transition-all group"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Submit Request <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
