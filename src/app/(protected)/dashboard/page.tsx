'use client'

import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    CalendarDays,
    Bell,
    CalendarCheck,
    Ticket,
    User,
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
        label: "Accounts",
        href: "/dashboard/account",
        icon: User,
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
        <div className="min-h-screen bg-background text-on-surface transition-colors duration-300">
            <div className="mx-auto flex w-11/12 max-w-7xl gap-8 py-10">
                {/* Sidebar */}
                <aside className="w-full max-w-xs rounded-3xl border border-outline-variant/30 bg-surface-container-low/80 p-6 shadow-sm backdrop-blur">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container shadow-lg neon-glow-primary">
                            <Ticket className="size-6" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-on-surface">
                                Partner Portal
                            </p>
                            <p className="text-sm text-on-surface-variant">
                                EventLux Business
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
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
                                        className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition cursor-pointer ${
                                            isActive
                                                ? "bg-primary/15 text-primary hover:bg-primary/20"
                                                : "text-on-surface-variant hover:bg-surface-container-high"
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
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                            Quick Stats
                        </p>
                        <div className="space-y-4 rounded-2xl border border-outline-variant/10 p-4">
                            {quickStats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={stat.label}
                                        className="flex items-center justify-between text-sm text-on-surface-variant"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="size-4 text-on-surface-variant/70" />
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
                <section className="flex-1 rounded-3xl border border-outline-variant/30 bg-surface-container px-8 py-10 shadow-sm transition-colors duration-300">
                    <div className="mb-6">
                        <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                            Dashboard Overview
                        </h1>
                        <p className="mt-2 text-on-surface-variant">
                            Track event performance and manage your organiser workspace.
                        </p>
                    </div>

                    {/* Placeholder content */}
                    <div className="grid gap-6 rounded-2xl border border-dashed border-outline-variant/30 p-10 text-center text-on-surface-variant bg-surface-container-low/30">
                        <p>
                            Your dashboard widgets will appear here once data is connected.
                        </p>
                        <Button
                            variant="outline"
                            className="mx-auto w-fit rounded-xl border-outline-variant text-primary hover:border-primary/50 hover:bg-primary/10 cursor-pointer"
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