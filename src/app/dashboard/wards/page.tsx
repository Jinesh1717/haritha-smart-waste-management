"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getWards, createWard } from "@/services/firestore"
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
import { MoreHorizontal, Plus, Search } from "lucide-react"

// Types
type Ward = {
    id?: string
    number: string
    name: string
    totalHouseholds: number
    assignedStaffId?: string
    status: "Active" | "Inactive"
}

export default function WardsPage() {
    const [wards, setWards] = useState<Ward[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Form State
    const [newWard, setNewWard] = useState<Partial<Ward>>({
        status: "Active",
    })

    useEffect(() => {
        const fetchWards = async () => {
            setIsLoading(true)
            try {
                const fetchedWards = await getWards()
                setWards(fetchedWards as Ward[])
            } catch (error) {
                console.error("Failed to fetch wards", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchWards()
    }, [])

    const filteredWards = wards.filter((w) =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.number.includes(searchQuery)
    )

    const handleAddWard = async () => {
        if (!newWard.name || !newWard.number || !newWard.totalHouseholds) return

        const completeWard = {
            number: newWard.number,
            name: newWard.name,
            totalHouseholds: Number(newWard.totalHouseholds),
            status: newWard.status as "Active" | "Inactive",
            assignedStaffId: newWard.assignedStaffId,
        }

        try {
            const newId = await createWard(completeWard)
            setWards([...wards, { id: newId, ...completeWard }])
            setIsAddOpen(false)
            setNewWard({ status: "Active" }) // Reset
        } catch (error) {
            console.error("Failed to create ward", error)
        }
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 text-slate-800">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight font-serif text-emerald-950">Ward Management</h2>
                <div className="flex items-center space-x-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md border border-emerald-400">
                                <Plus className="mr-2 h-4 w-4" /> Add Ward
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-2xl border-white/60">
                            <DialogHeader>
                                <DialogTitle className="text-emerald-950 font-serif text-xl">Add New Ward</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Enter the details of the new ward here. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="number" className="text-right text-emerald-900 font-bold">No.</Label>
                                    <Input
                                        id="number"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        type="number"
                                        value={newWard.number || ""}
                                        onChange={e => setNewWard({ ...newWard, number: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-emerald-900 font-bold">Name</Label>
                                    <Input
                                        id="name"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        value={newWard.name || ""}
                                        onChange={e => setNewWard({ ...newWard, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="households" className="text-right text-emerald-900 font-bold">Households</Label>
                                    <Input
                                        id="households"
                                        className="col-span-3 bg-white/50 border-white/60 focus-visible:ring-emerald-500 rounded-xl"
                                        type="number"
                                        value={newWard.totalHouseholds || ""}
                                        onChange={e => setNewWard({ ...newWard, totalHouseholds: parseInt(e.target.value) || undefined })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right text-emerald-900 font-bold">Status</Label>
                                    <div className="col-span-3">
                                        <Select
                                            value={newWard.status}
                                            onValueChange={(val: "Active" | "Inactive") => setNewWard({ ...newWard, status: val })}
                                        >
                                            <SelectTrigger className="bg-white/50 border-white/60 focus:ring-emerald-500 rounded-xl">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-100 rounded-xl">
                                                <SelectItem value="Active" className="focus:bg-emerald-50">Active</SelectItem>
                                                <SelectItem value="Inactive" className="focus:bg-slate-50">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddWard} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-600/50" />
                    <Input
                        placeholder="Search wards..."
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
                            <TableHead className="w-[100px] text-emerald-600 font-bold tracking-wider py-5">Ward No.</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Location Name</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Households</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Assigned Staff</TableHead>
                            <TableHead className="text-emerald-600 font-bold tracking-wider py-5">Status</TableHead>
                            <TableHead className="text-right text-emerald-600 font-bold tracking-wider py-5 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredWards.length === 0 ? (
                            <TableRow className="border-white/40">
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">
                                    No wards found matching that search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredWards.map((ward) => (
                                <TableRow key={ward.id} className="border-white/40 hover:bg-white/60 transition-colors">
                                    <TableCell className="font-bold text-emerald-900 py-4 pl-4">{ward.number}</TableCell>
                                    <TableCell className="font-medium text-slate-700">{ward.name}</TableCell>
                                    <TableCell className="text-slate-600">{ward.totalHouseholds.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {ward.assignedStaffId ? (
                                            <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50/50">{ward.assignedStaffId}</Badge>
                                        ) : (
                                            <span className="text-slate-400 italic text-sm">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ward.status === "Active" ? "default" : "secondary"}
                                            className={ward.status === "Active" ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"}>
                                            {ward.status}
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
                                                <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer">Assign Staff</DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-emerald-50 text-emerald-900 font-medium rounded-lg cursor-pointer">Edit Ward details</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-emerald-50" />
                                                <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600 font-medium rounded-lg cursor-pointer">Delete Ward</DropdownMenuItem>
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
