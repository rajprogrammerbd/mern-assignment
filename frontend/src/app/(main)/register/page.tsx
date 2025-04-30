'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail } from '@/lib/utils';
import { useRegisterMutation } from '@/store/api/authApi';
import { login } from '@/store/slices/accountSlice';
import { useAppDispatch } from '@/store/store';
import { IError, ILoginUserResponse } from '@/types';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username.length < 3) {
            setError('Full name must be at least 3 characters long');
            return;
        } else if (!validateEmail(email)) {
            setError('Valid email is required');
            return;
        } else if (password.trim() === '') {
            setError('Password is required');
            return;
        } else if (password.trim().length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        register({ username, email, password })
            .unwrap()
            .then((res: ILoginUserResponse) => {
                dispatch(login(res));
                router.push('/dashboard');
            })
            .catch((err: IError) => {
                if (err.status !== 200) {
                    toast.error(
                        err.data.message ||
                            'An error occurred. Please try again.'
                    );
                }
            });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <Card className="w-full max-w-md border-gray-800 bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    </div>
                    <CardTitle className="text-center text-2xl font-bold text-white">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Enter your details to create your Task Manage account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert
                                variant="destructive"
                                className="border-red-900 bg-red-950 text-red-300"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-300">
                                Full Name
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-gray-300"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Creating account...'
                                : 'Create account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-purple-400 hover:text-purple-300"
                        >
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
