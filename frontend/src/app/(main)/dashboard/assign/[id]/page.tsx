'use client';

import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { demoTasks } from '@/lib/demo-data';
import type { Task } from '@/lib/types';
import { ChevronLeft, Loader2, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AssignTaskPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const taskId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [task, setTask] = useState<Task | null>(null);
    const [assignedTo, setAssignedTo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Team members data
    const teamMembers = [
        {
            id: 'john',
            name: 'John Doe',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        {
            id: 'jane',
            name: 'Jane Smith',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        {
            id: 'alex',
            name: 'Alex Johnson',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        {
            id: 'sarah',
            name: 'Sarah Williams',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        {
            id: 'michael',
            name: 'Michael Brown',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        {
            id: 'emily',
            name: 'Emily Davis',
            avatar: '/placeholder.svg?height=40&width=40'
        }
    ];

    useEffect(() => {
        // Simulate API call to get task details
        const currentTask = demoTasks.find((t) => t.id === taskId);

        if (currentTask) {
            setTask(currentTask);
            setAssignedTo(currentTask.assignedTo);
        }

        setIsLoading(false);
    }, [taskId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call to assign task
        setTimeout(() => {
            toast({
                title: 'Task assigned',
                description: `The task has been assigned to ${assignedTo}`
            });
            router.push('/dashboard');
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ChevronLeft className="h-5 w-5" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">
                        Task Not Found
                    </h1>
                </div>
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="text-gray-400">
                            The task you are looking for does not exist.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/dashboard">Return to Tasks</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                    Assign Task
                </h1>
            </div>

            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-xl text-white">
                            Assign &quot;{task.title}&quot;
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Choose a team member to assign this task
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-md border border-gray-700 bg-gray-800/50 p-4">
                            <h3 className="mb-2 font-medium text-white">
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {task.description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="assignedTo"
                                className="text-gray-300"
                            >
                                Assignee
                            </Label>
                            <Select
                                value={assignedTo}
                                onValueChange={setAssignedTo}
                                required
                            >
                                <SelectTrigger
                                    id="assignedTo"
                                    className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500"
                                >
                                    <SelectValue placeholder="Select team member" />
                                </SelectTrigger>
                                <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                    {teamMembers.map((member) => (
                                        <SelectItem
                                            key={member.id}
                                            value={member.name}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage
                                                        src={
                                                            member.avatar ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt={member.name}
                                                    />
                                                    <AvatarFallback className="bg-gray-700 text-xs text-gray-300">
                                                        {member.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {member.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center rounded-md border border-gray-700 bg-gray-800/20 p-4">
                            <UserCheck className="mr-3 h-5 w-5 text-purple-400" />
                            <p className="text-sm text-gray-300">
                                Currently assigned to{' '}
                                {task.assignedTo || 'no one'}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                            asChild
                        >
                            <Link href="/dashboard">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Assigning...' : 'Assign Task'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
