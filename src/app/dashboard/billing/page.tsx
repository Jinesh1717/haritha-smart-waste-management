"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Receipt, IndianRupee, FileText, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

// Types
type Invoice = {
    id: string
    householdName: string
    ward: string
    amount: number
    status: "Paid" | "Pending" | "Overdue"
    date: string
}

// Mock Data
const MOCK_INVOICES: Invoice[] = [
    { id: "INV-2026-001", householdName: "Ramesh Krishnan", ward: "Ward 1", amount: 150, status: "Paid", date: "2026-02-01" },
    { id: "INV-2026-002", householdName: "Anita Menon", ward: "Ward 2", amount: 150, status: "Pending", date: "2026-02-15" },
    { id: "INV-2026-003", householdName: "George Varghese", ward: "Ward 1", amount: 300, status: "Overdue", date: "2026-01-01" },
    { id: "INV-2026-004", householdName: "Priya Das", ward: "Ward 4", amount: 150, status: "Paid", date: "2026-02-05" },
    { id: "INV-2026-005", householdName: "Sunil Kumar", ward: "Ward 3", amount: 150, status: "Pending", date: "2026-02-20" },
]

export default function BillingPage() {
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Form State
    const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
        status: "Pending",
        amount: 150, // Default base rate
    })

    const filteredInvoices = invoices.filter((inv) =>
        inv.householdName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.ward.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleGenerateInvoice = () => {
        if (!newInvoice.householdName || !newInvoice.ward || !newInvoice.amount) return

        const completeInvoice: Invoice = {
            id: `INV-2026-${Math.floor(Math.random() * 900) + 100}`,
            householdName: newInvoice.householdName,
            ward: newInvoice.ward,
            amount: Number(newInvoice.amount),
            status: newInvoice.status as "Paid" | "Pending" | "Overdue",
            date: new Date().toISOString().split('T')[0],
        }

        setInvoices([completeInvoice, ...invoices])
        setIsAddOpen(false)
        setNewInvoice({ status: "Pending", amount: 150 }) // Reset
    }

    // Calculations for KPIs
    const totalCollected = invoices.filter(i => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0)
    const totalPending = invoices.filter(i => i.status === "Pending" || i.status === "Overdue").reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 text-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight font-serif text-emerald-950">Billing & Collections</h2>
                    <p className="text-emerald-700/70 font-medium mt-1">Manage user subscriptions, payments, and generated invoices.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md border border-emerald-400">
                                <Plus className="mr-2 h-4 w-4" /> Generate Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-2xl border-white/60">
                            <DialogHeader>
                                <DialogTitle className="text-emerald-950 font-serif text-xl">Generate New Invoice</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Create a new manual bill for a household. Standard rate is ₹150.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="household" className="text-right text-emerald-900 font-bold">Household</Label>
                                    <Input
                                        id="household"
                                        placeholder="Name of resident"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newInvoice.householdName || ""}
                                        onChange={e => setNewInvoice({ ...newInvoice, householdName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="ward" className="text-right text-emerald-900 font-bold">Ward</Label>
                                    <Input
                                        id="ward"
                                        placeholder="e.g. Ward 1"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newInvoice.ward || ""}
                                        onChange={e => setNewInvoice({ ...newInvoice, ward: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right text-emerald-900 font-bold">Amount (₹)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newInvoice.amount || ""}
                                        onChange={e => setNewInvoice({ ...newInvoice, amount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right text-emerald-900 font-bold">Status</Label>
                                    <div className="col-span-3">
                                        <Select
                                            value={newInvoice.status}
                                            onValueChange={(val: "Paid" | "Pending" | "Overdue") => setNewInvoice({ ...newInvoice, status: val })}
                                        >
                                            <SelectTrigger className="bg-white/50 border-white/60 focus:ring-emerald-500 rounded-xl">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-100 rounded-xl">
                                                <SelectItem value="Paid" className="focus:bg-emerald-50 text-emerald-700">Paid</SelectItem>
                                                <SelectItem value="Pending" className="focus:bg-amber-50 text-amber-700">Pending</SelectItem>
                                                <SelectItem value="Overdue" className="focus:bg-red-50 text-red-700">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleGenerateInvoice} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm">Save Invoice</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white/60 to-emerald-50/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <IndianRupee className="w-16 h-16 text-emerald-900" />
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-widest flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4" /> Total Collected
                        </p>
                        <div className="text-4xl font-extrabold font-serif text-emerald-950 flex items-center">
                            <span className="text-2xl mr-1 font-sans text-emerald-700">₹</span>{totalCollected.toLocaleString()}
                        </div>
                        <p className="text-xs text-emerald-700 font-medium">For current billing cycle</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white/60 to-amber-50/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Clock className="w-16 h-16 text-amber-900" />
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <p className="text-sm font-bold text-amber-600/80 uppercase tracking-widest flex items-center gap-2">
                            <ArrowDownRight className="w-4 h-4" /> Pending Dues
                        </p>
                        <div className="text-4xl font-extrabold font-serif text-emerald-950 flex items-center">
                            <span className="text-2xl mr-1 font-sans text-amber-700">₹</span>{totalPending.toLocaleString()}
                        </div>
                        <p className="text-xs text-amber-700 font-medium">Pending + Overdue invoices</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white/60 to-emerald-50/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <FileText className="w-16 h-16 text-emerald-900" />
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-widest flex items-center gap-2">
                            Invoices Generated
                        </p>
                        <div className="text-4xl font-extrabold font-serif text-emerald-950">
                            {invoices.length}
                        </div>
                        <p className="text-xs text-emerald-700 font-medium">Total registered this month</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center space-x-2 py-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-600/50" />
                    <Input
                        placeholder="Search invoices by ID, name, or ward..."
                        className="pl-9 h-10 bg-white/40 border-white/60 text-emerald-950 placeholder:text-emerald-800/40 focus-visible:ring-emerald-500 backdrop-blur-md rounded-2xl shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/40 hover:bg-white/20">
                            <TableHead className="w-[150px] text-emerald-600 font-bold tracking-wider py-5 pl-6">Invoice ID</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Resident/Business Name</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Ward</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Issue Date</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5 text-right">Amount</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Status</TableHead>
                            <TableHead className="text-right text-emerald-600 font-bold tracking-wider py-5 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.length === 0 ? (
                            <TableRow className="border-white/40">
                                <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-medium">
                                    No invoices found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((inv) => (
                                <TableRow key={inv.id} className="border-white/40 hover:bg-white/60 transition-colors">
                                    <TableCell className="font-bold text-emerald-900 py-4 pl-6 text-sm">{inv.id}</TableCell>
                                    <TableCell className="font-medium text-slate-700">{inv.householdName}</TableCell>
                                    <TableCell className="text-slate-600">{inv.ward}</TableCell>
                                    <TableCell className="text-slate-500 text-sm font-medium">{inv.date}</TableCell>
                                    <TableCell className="font-bold text-emerald-950 text-right">₹{inv.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={inv.status === "Paid" ? "default" : "secondary"}
                                            className={
                                                inv.status === "Paid" ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200" :
                                                    inv.status === "Pending" ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200" :
                                                        "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                                            }>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-emerald-100 text-emerald-600 rounded-lg">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-lg p-1 min-w-[160px]">
                                                <DropdownMenuLabel className="text-slate-400 text-xs uppercase tracking-wider font-bold">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-emerald-50" />
                                                {inv.status !== "Paid" && (
                                                    <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer flex items-center gap-2">
                                                        Mark as Paid
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer flex items-center gap-2">
                                                    <Receipt className="w-4 h-4" /> View Receipt
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer flex items-center gap-2">
                                                    Download PDF
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
