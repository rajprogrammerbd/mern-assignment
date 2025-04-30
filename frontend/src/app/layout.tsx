import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/store/provider';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import type React from 'react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Task Management System',
    description: 'A modern task management system'
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ReduxProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
