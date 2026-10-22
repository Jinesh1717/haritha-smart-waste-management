import jsPDF from "jspdf";

export interface AttendanceRecord {
    id: string;
    collectorId: string;
    collectorName: string;
    ward: string;
    date: string;
    time: string;
    status: "Present" | "Half Day" | "On Leave";
    notes?: string;
}

export interface CollectionSchedule {
    id: string;
    date: string;
    wasteType: "Biodegradable" | "Non-biodegradable (Plastic)" | "E-Waste" | "Glass & Metal" | "Hazardous / Medical";
    ward: string;
    household: string;
    collectorName: string;
    status: "Scheduled" | "Completed" | "In Progress";
    notes?: string;
}

export interface BillInvoice {
    id: string;
    residentName: string;
    residentPhone: string;
    ward: string;
    month: string;
    amount: number;
    type: string;
    dueDate: string;
    status: "Pending" | "Paid" | "Overdue";
    collectorName?: string;
    paidDate?: string;
    paymentMethod?: string;
    receiptId?: string;
    notes?: string;
}

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
    {
        id: "ATT-101",
        collectorId: "S101",
        collectorName: "Rahul K.",
        ward: "Ward 2",
        date: "2026-10-19",
        time: "08:15 AM",
        status: "Present",
        notes: "Morning shift - Sector A"
    },
    {
        id: "ATT-102",
        collectorId: "S102",
        collectorName: "Lakshmi P.",
        ward: "Ward 1",
        date: "2026-10-19",
        time: "08:30 AM",
        status: "Present",
        notes: "Door-to-door organic collection"
    },
    {
        id: "ATT-103",
        collectorId: "S103",
        collectorName: "Suresh M.",
        ward: "Ward 3",
        date: "2026-10-18",
        time: "08:45 AM",
        status: "Present",
        notes: "Commercial waste route"
    }
];

const DEFAULT_SCHEDULES: CollectionSchedule[] = [
    {
        id: "SCH-01",
        date: "2026-10-21",
        wasteType: "Non-biodegradable (Plastic)",
        ward: "Ward 2",
        household: "Mahesh K. (House #42)",
        collectorName: "Rahul K.",
        status: "Scheduled",
        notes: "Dry cleaned plastic & bottles"
    },
    {
        id: "SCH-02",
        date: "2026-10-22",
        wasteType: "Biodegradable",
        ward: "Ward 2",
        household: "All Households",
        collectorName: "Rahul K.",
        status: "Scheduled",
        notes: "Kitchen & food waste segregation"
    },
    {
        id: "SCH-03",
        date: "2026-10-25",
        wasteType: "E-Waste",
        ward: "Ward 1 & 2",
        household: "Community Collection",
        collectorName: "Rahul K.",
        status: "Scheduled",
        notes: "Old electronics, batteries, and CFL bulbs"
    }
];

const DEFAULT_BILLS: BillInvoice[] = [
    {
        id: "INV-05-2026",
        residentName: "Mahesh K.",
        residentPhone: "9876543210",
        ward: "Ward 2",
        month: "May 2026",
        amount: 150,
        type: "Monthly User Fee",
        dueDate: "2026-05-05",
        status: "Overdue",
        collectorName: "Rahul K."
    },
    {
        id: "INV-06-2026",
        residentName: "Mahesh K.",
        residentPhone: "9876543210",
        ward: "Ward 2",
        month: "June 2026",
        amount: 150,
        type: "Monthly User Fee",
        dueDate: "2026-06-05",
        status: "Pending",
        collectorName: "Rahul K."
    },
    {
        id: "REC-04-2026",
        residentName: "Mahesh K.",
        residentPhone: "9876543210",
        ward: "Ward 2",
        month: "April 2026",
        amount: 150,
        type: "Monthly User Fee",
        dueDate: "2026-04-05",
        status: "Paid",
        collectorName: "Rahul K.",
        paidDate: "2026-04-02",
        paymentMethod: "UPI",
        receiptId: "HKS-REC-2026-0492"
    },
    {
        id: "REC-03-2026",
        residentName: "Mahesh K.",
        residentPhone: "9876543210",
        ward: "Ward 2",
        month: "March 2026",
        amount: 150,
        type: "Monthly User Fee",
        dueDate: "2026-03-05",
        status: "Paid",
        collectorName: "Rahul K.",
        paidDate: "2026-03-05",
        paymentMethod: "Credit Card",
        receiptId: "HKS-REC-2026-0381"
    }
];

// Helper to access LocalStorage safely in Next.js SSR
const isBrowser = typeof window !== "undefined";

export const getAttendanceRecords = (): AttendanceRecord[] => {
    if (!isBrowser) return DEFAULT_ATTENDANCE;
    const data = localStorage.getItem("hks_attendance");
    if (!data) {
        localStorage.setItem("hks_attendance", JSON.stringify(DEFAULT_ATTENDANCE));
        return DEFAULT_ATTENDANCE;
    }
    try {
        return JSON.parse(data);
    } catch {
        return DEFAULT_ATTENDANCE;
    }
};

export const markAttendance = (entry: Omit<AttendanceRecord, "id">): AttendanceRecord => {
    const list = getAttendanceRecords();
    const newRecord: AttendanceRecord = {
        ...entry,
        id: `ATT-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newRecord, ...list];
    if (isBrowser) {
        localStorage.setItem("hks_attendance", JSON.stringify(updated));
        window.dispatchEvent(new Event("hks_data_change"));
    }
    return newRecord;
};

export const getCollectionSchedules = (): CollectionSchedule[] => {
    if (!isBrowser) return DEFAULT_SCHEDULES;
    const data = localStorage.getItem("hks_schedules");
    if (!data) {
        localStorage.setItem("hks_schedules", JSON.stringify(DEFAULT_SCHEDULES));
        return DEFAULT_SCHEDULES;
    }
    try {
        return JSON.parse(data);
    } catch {
        return DEFAULT_SCHEDULES;
    }
};

export const addCollectionSchedule = (entry: Omit<CollectionSchedule, "id">): CollectionSchedule => {
    const list = getCollectionSchedules();
    const newSchedule: CollectionSchedule = {
        ...entry,
        id: `SCH-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newSchedule, ...list];
    if (isBrowser) {
        localStorage.setItem("hks_schedules", JSON.stringify(updated));
        window.dispatchEvent(new Event("hks_data_change"));
    }
    return newSchedule;
};

export const getBills = (): BillInvoice[] => {
    if (!isBrowser) return DEFAULT_BILLS;
    const data = localStorage.getItem("hks_bills");
    if (!data) {
        localStorage.setItem("hks_bills", JSON.stringify(DEFAULT_BILLS));
        return DEFAULT_BILLS;
    }
    try {
        return JSON.parse(data);
    } catch {
        return DEFAULT_BILLS;
    }
};

export const createBillRequest = (entry: Omit<BillInvoice, "id" | "status">): BillInvoice => {
    const list = getBills();
    const newBill: BillInvoice = {
        ...entry,
        id: `INV-${Date.now().toString().slice(-6)}`,
        status: "Pending",
    };
    const updated = [newBill, ...list];
    if (isBrowser) {
        localStorage.setItem("hks_bills", JSON.stringify(updated));
        window.dispatchEvent(new Event("hks_data_change"));
    }
    return newBill;
};

export const payBill = (billId: string, paymentMethod: string): BillInvoice | null => {
    const list = getBills();
    const index = list.findIndex(b => b.id === billId);
    if (index === -1) return null;

    const receiptId = `HKS-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedBill: BillInvoice = {
        ...list[index],
        status: "Paid",
        paidDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        paymentMethod,
        receiptId,
    };

    list[index] = updatedBill;
    if (isBrowser) {
        localStorage.setItem("hks_bills", JSON.stringify(list));
        window.dispatchEvent(new Event("hks_data_change"));
    }
    return updatedBill;
};

/**
 * Downloads a high-quality, official Haritha Karma Sena PDF receipt
 */
export const downloadReceiptPDF = (bill: BillInvoice) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5", // Convenient receipt size (148 x 210 mm)
    });

    const receiptNo = bill.receiptId || `HKS-REC-${Date.now().toString().slice(-6)}`;
    const paidDate = bill.paidDate || new Date().toLocaleDateString('en-GB');

    // Header styling - Emerald theme banner
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, 148, 30, "F");

    // Title & Emblem
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("HARITHA KARMA SENA", 74, 12, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Clean & Green Kerala Mission • Waste Management System", 74, 18, { align: "center" });
    doc.text("OFFICIAL PAYMENT RECEIPT", 74, 25, { align: "center" });

    // Receipt Meta Details Box
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    let y = 40;
    doc.text(`Receipt No: ${receiptNo}`, 12, y);
    doc.text(`Date: ${paidDate}`, 136, y, { align: "right" });

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(12, y, 136, y);

    // Resident Information
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("RESIDENT DETAILS", 12, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${bill.residentName}`, 12, y);
    doc.text(`Ward: ${bill.ward}`, 136, y, { align: "right" });

    y += 5;
    doc.text(`Contact: +91 ${bill.residentPhone}`, 12, y);
    doc.text(`Collector: ${bill.collectorName || "Field Agent (HKS)"}`, 136, y, { align: "right" });

    // Payment Summary Table
    y += 10;
    doc.setFillColor(241, 245, 249);
    doc.rect(12, y, 124, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Description", 15, y + 5);
    doc.text("Month", 85, y + 5);
    doc.text("Amount", 133, y + 5, { align: "right" });

    y += 13;
    doc.setFont("helvetica", "normal");
    doc.text(bill.type || "Waste Collection Fee", 15, y);
    doc.text(bill.month || "Current Period", 85, y);
    doc.setFont("helvetica", "bold");
    doc.text(`INR ${bill.amount.toFixed(2)}`, 133, y, { align: "right" });

    y += 8;
    doc.setDrawColor(203, 213, 225);
    doc.line(12, y, 136, y);

    // Total Amount Box
    y += 8;
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.rect(12, y, 124, 14, "F");
    doc.setDrawColor(16, 185, 129);
    doc.rect(12, y, 124, 14, "D");

    doc.setTextColor(6, 95, 70); // emerald-800
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL AMOUNT PAID:", 18, y + 9);
    doc.setFontSize(12);
    doc.text(`INR ${bill.amount.toFixed(2)}`, 130, y + 9, { align: "right" });

    // Payment Method & Status
    y += 20;
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Mode: ${bill.paymentMethod || "Online / UPI"}`, 12, y);
    doc.text("Status: VERIFIED & COMPLETED", 136, y, { align: "right" });

    // Seal & Footer Notes
    y += 15;
    doc.setDrawColor(16, 185, 129);
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(44, y, 60, 16, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105);
    doc.text("HARITHA KARMA SENA", 74, y + 6, { align: "center" });
    doc.text("DIGITALLY CERTIFIED RECEIPT", 74, y + 11, { align: "center" });

    y += 24;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for segregating your waste and keeping our surroundings clean and green.", 74, y, { align: "center" });
    doc.text("This is a computer-generated receipt. No physical signature required.", 74, y + 4, { align: "center" });

    // Download PDF file
    doc.save(`HKS_Receipt_${receiptNo}.pdf`);
};
