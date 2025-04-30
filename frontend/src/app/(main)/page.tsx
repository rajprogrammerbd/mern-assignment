'use client';

import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    useAuthRedirect('authenticated', '/dashboard');

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                        <span className="text-xl font-bold text-white">
                            Task Manage
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className="text-gray-300 hover:text-white"
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 text-center md:py-24">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
                        Task Management{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            System
                        </span>
                    </h1>
                    <p className="mb-8 max-w-2xl text-lg text-gray-300">
                        A task management system with real-time updates,
                        collaborative features, and intuitive interface.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                            >
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-[#09090b]"
                            >
                                Login
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <footer className="border-t border-gray-800 bg-gray-900/50 py-6 text-center text-sm text-gray-400">
                <div className="container mx-auto px-4">
                    <p>
                        ©{new Date().getFullYear()} Task Manage. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
