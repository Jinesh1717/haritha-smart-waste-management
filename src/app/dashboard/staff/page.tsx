"use client"

import { useState } from "react"
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
import { MoreHorizontal, Search, UserPlus } from "lucide-react"

// Types
type Staff = {
    id: string
    name: string
    phone: string
    assignedWard?: string
    status: "Active" | "On Leave" | "Inactive"
    joinedDate: string
}

// Mock Data
const MOCK_STAFF: Staff[] = [
    { id: "S101", name: "Lakshmi K", phone: "+91 9876543210", assignedWard: "Ward 1", status: "Active", joinedDate: "2023-01-15" },
    { id: "S102", name: "Suresh P", phone: "+91 8765432109", assignedWard: "Ward 2", status: "Active", joinedDate: "2023-03-22" },
    { id: "S103", name: "Mini T", phone: "+91 7654321098", status: "On Leave", joinedDate: "2023-06-10" },
    { id: "S104", name: "Rajesh S", phone: "+91 6543210987", assignedWard: "Ward 4", status: "Active", joinedDate: "2024-01-05" },
    { id: "S105", name: "Bhavana V", phone: "+91 5432109876", status: "Inactive", joinedDate: "2022-11-30" },
]

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Form State
    const [newStaff, setNewStaff] = useState<Partial<Staff>>({
        status: "Active",
    })

    const filteredStaff = staffList.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
    )

    const handleAddStaff = () => {
        if (!newStaff.name || !newStaff.phone) return

        const completeStaff: Staff = {
            id: `S${Math.floor(Math.random() * 900) + 100}`, // Generate random ID like S123
            name: newStaff.name,
            phone: newStaff.phone,
            assignedWard: newStaff.assignedWard,
            status: newStaff.status as "Active" | "On Leave" | "Inactive",
            joinedDate: new Date().toISOString().split('T')[0],
        }

        setStaffList([...staffList, completeStaff])
        setIsAddOpen(false)
        setNewStaff({ status: "Active" }) // Reset
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 text-slate-800">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight font-serif text-emerald-950">Staff Management</h2>
                <div className="flex items-center space-x-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md border border-emerald-400">
                                <UserPlus className="mr-2 h-4 w-4" /> Add Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-2xl border-white/60">
                            <DialogHeader>
                                <DialogTitle className="text-emerald-950 font-serif text-xl">Add New Staff Member</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Enter the details of the new worker. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-emerald-900 font-bold">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Full Name"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newStaff.name || ""}
                                        onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right text-emerald-900 font-bold">Phone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+91 "
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newStaff.phone || ""}
                                        onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="ward" className="text-right text-emerald-900 font-bold">Ward (Opt)</Label>
                                    <Input
                                        id="ward"
                                        placeholder="e.g. Ward 1"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newStaff.assignedWard || ""}
                                        onChange={e => setNewStaff({ ...newStaff, assignedWard: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right text-emerald-900 font-bold">Status</Label>
                                    <div className="col-span-3">
                                        <Select
                                            value={newStaff.status}
                                            onValueChange={(val: "Active" | "On Leave" | "Inactive") => setNewStaff({ ...newStaff, status: val })}
                                        >
                                            <SelectTrigger className="bg-white/50 border-white/60 focus:ring-emerald-500 rounded-xl">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-100 rounded-xl">
                                                <SelectItem value="Active" className="focus:bg-emerald-50">Active</SelectItem>
                                                <SelectItem value="On Leave" className="focus:bg-amber-50">On Leave</SelectItem>
                                                <SelectItem value="Inactive" className="focus:bg-slate-50">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddStaff} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm">Save Staff</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-600/50" />
                    <Input
                        placeholder="Search by name, ID, or phone..."
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
                            <TableHead className="w-[100px] text-emerald-600 font-bold tracking-wider py-5">Staff ID</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Name</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Contact</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Assigned Ward</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Status</TableHead>
                            <TableHead className="text-right text-emerald-600 font-bold tracking-wider py-5 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStaff.length === 0 ? (
                            <TableRow className="border-white/40">
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">
                                    No staff members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStaff.map((staff) => (
                                <TableRow key={staff.id} className="border-white/40 hover:bg-white/60 transition-colors">
                                    <TableCell className="font-bold text-emerald-900 py-4 pl-4">{staff.id}</TableCell>
                                    <TableCell className="font-medium text-slate-700">{staff.name}</TableCell>
                                    <TableCell className="text-slate-600">{staff.phone}</TableCell>
                                    <TableCell>
                                        {staff.assignedWard ? (
                                            <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50/50">{staff.assignedWard}</Badge>
                                        ) : (
                                            <span className="text-slate-400 italic text-sm">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={staff.status === "Active" ? "default" : "secondary"}
                                            className={
                                                staff.status === "Active" ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200" :
                                                    staff.status === "On Leave" ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200" :
                                                        "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                                            }>
                                            {staff.status}
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
                                            <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-lg p-1">
                                                <DropdownMenuLabel className="text-slate-400 text-xs uppercase tracking-wider font-bold">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-emerald-50" />
                                                <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer">Edit Profile</DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer">View History</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-emerald-50" />
                                                <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600 font-medium rounded-lg cursor-pointer">Deactivate</DropdownMenuItem>
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
