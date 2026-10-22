"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard,
    IndianRupee,
    ArrowRight,
    Download,
    CheckCircle2,
    AlertCircle,
    QrCode,
    Smartphone,
    Building2,
    Banknote,
    FileText,
    Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { getBills, payBill, downloadReceiptPDF, BillInvoice } from "@/services/wasteStore";

export default function PaymentsPage() {
    const [bills, setBills] = useState<BillInvoice[]>([]);
    const [selectedBill, setSelectedBill] = useState<BillInvoice | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("UPI / QR Code");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paidSuccessBill, setPaidSuccessBill] = useState<BillInvoice | null>(null);

    const refreshBills = () => {
        setBills(getBills());
    };

    useEffect(() => {
        refreshBills();
        const handleSync = () => refreshBills();
        window.addEventListener("hks_data_change", handleSync);
        return () => window.removeEventListener("hks_data_change", handleSync);
    }, []);

    const pendingDues = bills.filter(b => b.status === "Pending" || b.status === "Overdue");
    const paymentHistory = bills.filter(b => b.status === "Paid");

    const totalDue = pendingDues.reduce((sum, item) => sum + item.amount, 0);

    const handleOpenPayment = (bill: BillInvoice) => {
        setSelectedBill(bill);
        setIsPaymentModalOpen(true);
    };

    const handlePayAll = () => {
        if (pendingDues.length === 0) return;
        setSelectedBill(pendingDues[0]);
        setIsPaymentModalOpen(true);
    };

    const handleExecutePayment = () => {
        if (!selectedBill) return;

        setIsProcessing(true);
        setTimeout(() => {
            const updated = payBill(selectedBill.id, paymentMethod);
            setIsProcessing(false);
            setIsPaymentModalOpen(false);
            if (updated) {
                setPaidSuccessBill(updated);
                refreshBills();
            }
        }, 1200);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-3 font-serif">
                    <CreditCard className="text-emerald-600 w-8 h-8" /> Payments & User Fees
                </h1>
                <p className="text-slate-500 text-base">
                    Pay Haritha Karma Sena monthly collection fees and instantly download verified official PDF receipts.
                </p>
            </div>

            {/* Demo Payment Notice */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold">Demo Mode — No Real Payment Processed</p>
                    <p className="text-amber-700 text-xs mt-0.5">
                        This system currently records payment status for demonstration purposes. Integration with a real UPI / Razorpay gateway will be enabled before the official launch. PDF receipts are fully functional.
                    </p>
                </div>
            </div>

            {/* Success Celebration Banner */}
            <AnimatePresence>
                {paidSuccessBill && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                <Sparkles className="w-6 h-6 text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Payment Successful!</h3>
                                <p className="text-xs text-emerald-100">
                                    ₹{paidSuccessBill.amount} paid for {paidSuccessBill.month} ({paidSuccessBill.receiptId || "Verified"}).
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => downloadReceiptPDF(paidSuccessBill)}
                                className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md rounded-xl"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download PDF Receipt
                            </Button>
                            <Button
                                onClick={() => setPaidSuccessBill(null)}
                                variant="ghost"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Total Due Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-1">
                    <Card className="border-white/60 bg-white/50 backdrop-blur-md overflow-hidden relative h-full flex flex-col shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        <CardHeader>
                            <CardDescription className="text-red-600 font-bold uppercase tracking-wider text-xs">
                                Total Amount Due
                            </CardDescription>
                            <CardTitle className="text-4xl text-emerald-950 font-extrabold flex items-center">
                                <IndianRupee className="w-8 h-8 mr-1 opacity-80" />{totalDue}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-2 text-sm text-slate-600 mt-2 border-t border-white/60 pt-4">
                                <div className="flex justify-between">
                                    <span>Pending Invoices</span>
                                    <span className="text-emerald-950 font-bold">{pendingDues.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ward Coverage</span>
                                    <span className="text-emerald-950 font-medium">Ward 2 (Kavalam)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Official Receipt</span>
                                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Instant PDF
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handlePayAll}
                                disabled={totalDue === 0}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-900/10 h-12 text-base font-bold transition-all rounded-xl"
                            >
                                Pay Pending Fees <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Tabs for Pending / History */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2">
                    <Card className="border-white/60 bg-white/50 backdrop-blur-sm h-full shadow-sm">
                        <Tabs defaultValue="pending" className="w-full h-full flex flex-col">
                            <CardHeader className="pb-3 border-b border-white/60">
                                <TabsList className="bg-emerald-50 border border-emerald-200 w-full justify-start p-1 h-auto rounded-xl">
                                    <TabsTrigger
                                        value="pending"
                                        className="data-[state=active]:bg-white data-[state=active]:text-emerald-950 text-slate-600 py-2.5 px-5 rounded-lg font-bold"
                                    >
                                        Pending Fees ({pendingDues.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="history"
                                        className="data-[state=active]:bg-white data-[state=active]:text-emerald-950 text-slate-600 py-2.5 px-5 rounded-lg font-bold"
                                    >
                                        Receipts & History ({paymentHistory.length})
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">

                                {/* PENDING INVOICES TAB */}
                                <TabsContent value="pending" className="m-0 relative h-full min-h-[320px]">
                                    <div className="p-4 space-y-3">
                                        {pendingDues.length === 0 ? (
                                            <div className="text-center py-12 text-slate-400">
                                                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
                                                <p className="font-bold text-slate-700 text-base">All caught up!</p>
                                                <p className="text-xs">No pending waste management fees.</p>
                                            </div>
                                        ) : (
                                            pendingDues.map((due) => (
                                                <div
                                                    key={due.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/80 border border-emerald-100 relative overflow-hidden shadow-sm"
                                                >
                                                    {due.status === "Overdue" && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />}
                                                    {due.status === "Pending" && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />}

                                                    <div className="mb-3 sm:mb-0 pl-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-emerald-950 font-bold text-base">{due.month}</h3>
                                                            {due.status === "Overdue" ? (
                                                                <Badge className="bg-red-500/10 text-red-600 border-red-300 text-xs font-semibold">
                                                                    <AlertCircle className="w-3 h-3 mr-1" /> Overdue
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-amber-500/10 text-amber-700 border-amber-300 text-xs font-semibold">
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500">
                                                            {due.type} • Due: {due.dueDate} {due.collectorName && `• Collector: ${due.collectorName}`}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pl-2">
                                                        <div className="text-xl font-black text-emerald-950 flex items-center">
                                                            <IndianRupee className="w-4 h-4 mr-0.5 opacity-70" />{due.amount}
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleOpenPayment(due)}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                                                        >
                                                            Pay Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                {/* PAYMENT HISTORY & DOWNLOAD RECEIPTS TAB */}
                                <TabsContent value="history" className="m-0 h-full min-h-[320px]">
                                    <div className="p-4 space-y-3">
                                        {paymentHistory.map((payment) => (
                                            <div
                                                key={payment.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/80 border border-emerald-100 hover:bg-white transition-colors group shadow-sm"
                                            >
                                                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-emerald-950 font-bold text-sm">{payment.month}</h3>
                                                        <p className="text-xs text-slate-500">
                                                            Paid on {payment.paidDate} • Mode: {payment.paymentMethod || "Online"}
                                                        </p>
                                                        {payment.receiptId && (
                                                            <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                                                                Ref: {payment.receiptId}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                    <div className="text-right">
                                                        <div className="font-extrabold text-emerald-950 text-base flex items-center justify-end">
                                                            <IndianRupee className="w-3.5 h-3.5 mr-0.5 opacity-70" />{payment.amount}
                                                        </div>
                                                        <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end mt-0.5">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                                                        </span>
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        onClick={() => downloadReceiptPDF(payment)}
                                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-lg text-xs"
                                                        title="Download Official PDF Receipt"
                                                    >
                                                        <Download className="w-3.5 h-3.5 mr-1 text-emerald-700" /> PDF Receipt
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

            {/* PAYMENT DIALOG MODAL */}
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-emerald-100 rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-emerald-950 font-serif flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-emerald-600" /> Make Payment
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Haritha Karma Sena User Fee • Clean Kerala Mission
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBill && (
                        <div className="space-y-4 py-2">
                            {/* Bill Summary */}
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Billing Period</p>
                                    <p className="font-bold text-emerald-950">{selectedBill.month}</p>
                                    <p className="text-[11px] text-slate-400">{selectedBill.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-medium">Payable Amount</p>
                                    <p className="text-2xl font-extrabold text-emerald-800">₹{selectedBill.amount}</p>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Payment Mode</p>
                                
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { id: "UPI / QR Code", icon: QrCode, label: "UPI / QR Code" },
                                        { id: "Credit / Debit Card", icon: CreditCard, label: "Cards" },
                                        { id: "Net Banking", icon: Building2, label: "Net Banking" },
                                        { id: "Cash to Collector", icon: Banknote, label: "Cash to Staff" },
                                    ].map((mode) => {
                                        const Icon = mode.icon;
                                        const isSelected = paymentMethod === mode.id;
                                        return (
                                            <button
                                                key={mode.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(mode.id)}
                                                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all text-left ${
                                                    isSelected
                                                        ? "border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm"
                                                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                                }`}
                                            >
                                                <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                                                <span>{mode.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {paymentMethod === "UPI / QR Code" && (
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                                    <div className="w-24 h-24 mx-auto bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                        <QrCode className="w-20 h-20 text-slate-800" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-mono">
                                        UPI ID: haritha.karmasena@upi
                                    </p>
                                </div>
                            )}

                            <div className="text-[11px] text-slate-500 text-center">
                                Verified by Government of Kerala Local Self Government Department.
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="rounded-xl border-slate-200"
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleExecutePayment}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl flex-1 shadow-md"
                        >
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                `Confirm & Pay ₹${selectedBill?.amount || 0}`
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
