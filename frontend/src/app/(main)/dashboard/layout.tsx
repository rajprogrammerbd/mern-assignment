'use client';

import type React from 'react';

// import { NotificationPanel } from '@/components/notification-panel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent } from '@/components/ui/sheet';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { useAppDispatch } from '@/store/store';
import { logout } from '@/store/thunk/login';
import { CheckSquare, LogOut, Menu, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    // const [notificationCount, setNotificationCount] = useState(3);

    const dispatch = useAppDispatch();

    const navigation = [
        { name: 'Tasks', href: '/dashboard', icon: CheckSquare }
    ];

    useAuthRedirect('unauthenticated', '/login');

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Top navigation */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            <Menu className="h-6 w-6 text-gray-300" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                            <span className="text-xl font-bold text-white">
                                Task Manage
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative"
                                        onClick={() => {
                                            setIsNotificationOpen(
                                                !isNotificationOpen
                                            );
                                            setNotificationCount(0);
                                        }}
                                    >
                                        <Bell className="h-5 w-5 text-gray-300" />
                                        {notificationCount > 0 && (
                                            <Badge
                                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0 text-xs text-white"
                                                variant="outline"
                                            >
                                                {notificationCount}
                                            </Badge>
                                        )}
                                        <span className="sr-only">
                                            Notifications
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Notifications</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider> */}
                        {/* <Sheet
                            open={isNotificationOpen}
                            onOpenChange={setIsNotificationOpen}
                        >
                            <SheetContent className="border-gray-800 bg-gray-900 text-gray-100">
                                <NotificationPanel />
                            </SheetContent>
                        </Sheet> */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href="/dashboard/new">
                                            <Plus className="h-5 w-5 text-gray-300" />
                                            <span className="sr-only">
                                                Create task
                                            </span>
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create new task</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Avatar className="h-8 w-8 cursor-pointer border border-gray-700">
                            <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="User"
                            />
                            <AvatarFallback className="bg-gray-800 text-gray-300">
                                JD
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar for desktop */}
                <aside className="hidden w-64 border-r border-gray-800 bg-gray-900/50 md:block">
                    <nav className="flex h-full flex-col gap-1 p-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${isActive ? 'text-purple-400' : ''}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="mt-auto">
                            <span
                                onClick={() => dispatch(logout())}
                                className="flex items-center cursor-pointer gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </span>
                        </div>
                    </nav>
                </aside>

                {/* Mobile menu */}
                <div
                    className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity md:hidden ${
                        isMobileMenuOpen
                            ? 'opacity-100'
                            : 'pointer-events-none opacity-0'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>

                <div
                    className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-800 bg-gray-900 p-4 transition-transform duration-200 ease-in-out md:hidden ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                            <span className="text-xl font-bold text-white">
                                Task Manage
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="h-5 w-5 text-gray-300" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${isActive ? 'text-purple-400' : ''}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="mt-auto pt-4">
                            <span
                                onClick={() => dispatch(logout())}
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </span>
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
