'use client'

import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    CalendarDays,
    Bell,
    CalendarCheck,
    Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const navigationItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Create Event",
        href: "/dashboard/create-event",
        icon: PlusCircle,
    },
    {
        label: "My Events",
        href: "/dashboard/my-events",
        icon: CalendarDays,
    },
    {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
    },
];

const quickStats = [
    {
        label: "Active Events",
        value: "3",
        icon: CalendarCheck,
        valueClass: "text-gray-900 dark:text-gray-100",
    },
    {
        label: "Tickets Sold",
        value: "247",
        icon: Ticket,
        valueClass: "text-emerald-500 font-semibold",
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (href: string) => {
        router.push(href);
    };
    useEffect(()=>{
        
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex w-11/12 max-w-7xl gap-8 py-10">
                {/* Sidebar */}
                <aside className="w-full max-w-xs rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg">
                            <Ticket className="size-6" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-900">
                                Partner Portal
                            </p>
                            <p className="text-sm text-slate-500">
                                EventLux Business
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Menu
                        </p>
                        <nav className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Button
                                        key={item.href}
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition ${
                                            isActive
                                                ? "bg-violet-50 text-violet-600 hover:bg-violet-100"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                        onClick={() => handleNavigation(item.href)}
                                    >
                                        <Icon className="size-5" />
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-10">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Quick Stats
                        </p>
                        <div className="space-y-4 rounded-2xl border border-slate-100 p-4">
                            {quickStats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={stat.label}
                                        className="flex items-center justify-between text-sm text-slate-500"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="size-4 text-slate-400" />
                                            <span>{stat.label}</span>
                                        </div>
                                        <span className={stat.valueClass}>{stat.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <section className="flex-1 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
                    <div className="mb-6">
                        <h1 className="text-3xl font-semibold text-slate-900">
                            Dashboard Overview
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Track event performance and manage your organiser workspace.
                        </p>
                    </div>

                    {/* Placeholder content */}
                    <div className="grid gap-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-400">
                        <p>
                            Your dashboard widgets will appear here once data is connected.
                        </p>
                        <Button
                            variant="outline"
                            className="mx-auto w-fit rounded-xl border-slate-200 text-violet-600 hover:border-violet-200 hover:bg-violet-50"
                            onClick={() => handleNavigation("/dashboard/create-event")}
                        >
                            <PlusCircle className="mr-2 size-4" />
                            Create your first event
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}