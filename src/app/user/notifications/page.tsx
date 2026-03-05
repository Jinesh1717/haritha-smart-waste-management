"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Truck, AlertTriangle, Info, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "alert",
            title: "Collection Delayed",
            message: "Today's waste collection in Ward 5 is delayed by 2 hours due to heavy rain.",
            time: "2 hours ago",
            read: false,
        },
        {
            id: 2,
            type: "success",
            title: "Waste Collected",
            message: "Your biodegradable waste (2.5kg) was successfully collected by Rahul K.",
            time: "1 day ago",
            read: true,
        },
        {
            id: 3,
            type: "info",
            title: "New Recycling Guidelines",
            message: "Please separate e-waste from general dry waste. New bins have been provided at the junction.",
            time: "3 days ago",
            read: true,
        },
        {
            id: 4,
            type: "payment",
            title: "Payment Overdue",
            message: "Your monthly collection fee of ₹150 for May is overdue. Please pay to avoid service interruption.",
            time: "5 days ago",
            read: false,
        },
        {
            id: 5,
            type: "reminder",
            title: "Upcoming Collection",
            message: "Tomorrow is Dry Waste collection day. Please keep your bins ready.",
            time: "1 week ago",
            read: true,
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "alert": return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case "success": return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
            case "payment": return <AlertTriangle className="w-5 h-5 text-amber-400" />;
            case "reminder": return <Truck className="w-5 h-5 text-blue-400" />;
            default: return <Info className="w-5 h-5 text-teal-600" />;
        }
    };

    const getBgColor = (type: string, read: boolean) => {
        if (read) return "bg-green-950/20 hover:bg-green-900/30 border-white/60";

        switch (type) {
            case "alert": return "bg-white/40 hover:bg-red-900/30 border-red-800/40";
            case "success": return "bg-white/50 hover:bg-white/40 border-emerald-500/30";
            case "payment": return "bg-amber-950/20 hover:bg-amber-900/30 border-amber-800/40";
            case "reminder": return "bg-blue-950/20 hover:bg-blue-900/30 border-blue-800/40";
            default: return "bg-teal-950/20 hover:bg-teal-900/30 border-teal-800/40";
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-3">
                        <div className="relative">
                            <Bell className="text-emerald-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </div>
                        Notifications
                    </h1>
                    <p className="text-slate-500/70 text-base">Stay updated on collections, payments, and system alerts.</p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        className="border-emerald-200 bg-white/50 text-emerald-700 hover:bg-emerald-800/40 hover:text-slate-600"
                    >
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.map((notification, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            key={notification.id}
                        >
                            <Card className={`border backdrop-blur-sm transition-colors relative overflow-hidden group ${getBgColor(notification.type, notification.read)}`}>
                                {!notification.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500" />
                                )}

                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 mt-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-white/50' : 'bg-green-950/50 shadow-inner'}`}>
                                                {getIcon(notification.type)}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className={`text-base sm:text-lg font-medium truncate ${notification.read ? 'text-slate-500/80' : 'text-emerald-950'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-slate-500/50 shrink-0 whitespace-nowrap mt-1">
                                                    {notification.time}
                                                </span>
                                            </div>

                                            <p className={`text-sm leading-relaxed ${notification.read ? 'text-slate-500/60' : 'text-slate-500/90'}`}>
                                                {notification.message}
                                            </p>

                                            {!notification.read && notification.type === "payment" && (
                                                <div className="mt-3">
                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-emerald-950 h-8 text-xs">
                                                        Pay Now
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center pl-2 border-l border-white/60">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-red-600/70 hover:text-red-600 hover:bg-red-950/30 h-8 w-8"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-white/60 rounded-xl bg-white/40">
                        <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-emerald-600" />
                        </div>
                        <p className="text-slate-500/80 font-medium mb-1">All caught up!</p>
                        <p className="text-sm text-slate-500/50">You don&apos;t have any notifications right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
