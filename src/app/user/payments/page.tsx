"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, History, IndianRupee, ArrowRight, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function PaymentsPage() {
    const [isProcessing, setIsProcessing] = useState(false);

    const pendingDues = [
        { id: "INV-05-2026", month: "May 2026", amount: 150, type: "Monthly Fee", dueDate: "05 May 2026", status: "Overdue" },
        { id: "INV-06-2026", month: "June 2026", amount: 150, type: "Monthly Fee", dueDate: "05 Jun 2026", status: "Upcoming" },
    ];

    const paymentHistory = [
        { id: "REC-04-2026", date: "02 Apr 2026", amount: 150, month: "April 2026", method: "UPI", status: "Success" },
        { id: "REC-03-2026", date: "05 Mar 2026", amount: 150, month: "March 2026", method: "Credit Card", status: "Success" },
        { id: "REC-02-2026", date: "01 Feb 2026", amount: 150, month: "February 2026", method: "UPI", status: "Success" },
    ];

    const totalDue = pendingDues.filter(due => due.status === "Overdue").reduce((sum, item) => sum + item.amount, 0);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment gateway opening
        setTimeout(() => {
            setIsProcessing(false);
            // Payment logic would go here
            alert("Opening payment gateway for ₹" + totalDue);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-3">
                    <CreditCard className="text-emerald-600" /> Payments & Dues
                </h1>
                <p className="text-slate-500/70 text-base">Manage your monthly subscription fees and view payment history.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Total Due Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-1">
                    <Card className="border-white/60 bg-white/40 backdrop-blur-md overflow-hidden relative h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        <CardHeader>
                            <CardDescription className="text-red-600 font-medium">Total Amount Due</CardDescription>
                            <CardTitle className="text-4xl text-emerald-950 flex items-center">
                                <IndianRupee className="w-8 h-8 mr-1 opacity-70" />{totalDue}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-2 text-sm text-slate-500/70 mt-4 border-t border-white/60 pt-4">
                                <div className="flex justify-between">
                                    <span>Overdue Invoices</span>
                                    <span className="text-emerald-950 font-medium">{pendingDues.filter(due => due.status === "Overdue").length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Late Fees</span>
                                    <span className="text-emerald-950 font-medium">₹0</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handlePayment}
                                disabled={totalDue === 0 || isProcessing}
                                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-emerald-950 shadow-lg shadow-red-900/20 h-12 text-lg transition-all"
                            >
                                {isProcessing ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Pay ₹{totalDue} <ArrowRight className="ml-2 w-5 h-5" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Tabs for Pending / History */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2">
                    <Card className="border-white/60 bg-white/40 backdrop-blur-sm h-full">
                        <Tabs defaultValue="pending" className="w-full h-full flex flex-col">
                            <CardHeader className="pb-3 border-b border-white/60">
                                <TabsList className="bg-emerald-50 border border-emerald-200 w-full justify-start p-1 h-auto">
                                    <TabsTrigger value="pending" className="data-[state=active]:bg-white/60 data-[state=active]:text-emerald-950 text-slate-500/70 py-2 px-4 rounded-md">
                                        Pending Invoices
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-white/60 data-[state=active]:text-emerald-950 text-slate-500/70 py-2 px-4 rounded-md">
                                        Payment History
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <TabsContent value="pending" className="m-0 relative h-full min-h-[300px]">
                                    <div className="p-4 space-y-4">
                                        {pendingDues.map((due) => (
                                            <div key={due.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/50 border border-white/60 relative overflow-hidden">
                                                {due.status === "Overdue" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}
                                                {due.status === "Upcoming" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />}

                                                <div className="mb-3 sm:mb-0 pl-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-emerald-950 font-medium text-lg">{due.month}</h3>
                                                        {due.status === "Overdue" ? (
                                                            <Badge className="bg-red-500/20 text-red-600 border-red-500/30"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Upcoming</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500/50">{due.type} • Due: {due.dueDate}</p>
                                                </div>

                                                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pl-2">
                                                    <div className="text-xl font-bold text-emerald-950 flex items-center">
                                                        <IndianRupee className="w-4 h-4 mr-0.5 opacity-70" />{due.amount}
                                                    </div>
                                                    {due.status === "Overdue" && (
                                                        <Button size="sm" variant="outline" className="border-emerald-700/50 text-emerald-700 hover:bg-emerald-100">
                                                            Pay Item
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="history" className="m-0 h-full min-h-[300px]">
                                    <div className="p-4 space-y-4">
                                        {paymentHistory.map((payment) => (
                                            <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/50 border border-white/60 hover:bg-white/40 transition-colors group">
                                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-white/60 transition-colors">
                                                        <IndianRupee className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-emerald-950 font-medium">{payment.month}</h3>
                                                        <p className="text-xs text-slate-500/50">{payment.date} • {payment.method}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-14 sm:pl-0">
                                                    <div className="text-right">
                                                        <div className="font-bold text-emerald-950 flex items-center justify-end">
                                                            <IndianRupee className="w-3 h-3 mr-0.5 opacity-70" />{payment.amount}
                                                        </div>
                                                        <span className="text-xs text-emerald-600 flex items-center justify-end mt-0.5">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Success
                                                        </span>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-800/40" title="Download Receipt">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
