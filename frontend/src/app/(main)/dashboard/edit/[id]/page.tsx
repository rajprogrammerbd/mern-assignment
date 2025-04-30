'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { RootState, useAppSelector } from '@/store/store';
import { Task } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const taskId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [task, setTask] = useState<Task | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [assignedTo, setAssignedTo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tasks = useAppSelector((state: RootState) => state.allTasks.allTasks);

    useEffect(() => {
        // Simulate API call to get task details
        const currentTask = tasks.find((t) => t.id === taskId);

        if (currentTask) {
            setTask(currentTask);
            setTitle(currentTask.title);
            setDescription(currentTask.description);
            setPriority(currentTask.priority);
            setStatus(currentTask.status);
            setDueDate(new Date(currentTask.dueDate));
            setAssignedTo(currentTask.assignedUser.username);
        }

        setIsLoading(false);
    }, [taskId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call to update task
        setTimeout(() => {
            toast({
                title: 'Task updated',
                description: 'The task has been updated successfully'
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
                    Edit Task
                </h1>
            </div>

            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-xl text-white">
                            Task Details
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Update the information for this task
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-gray-300">
                                Title
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-gray-300"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-32 border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="priority"
                                    className="text-gray-300"
                                >
                                    Priority
                                </Label>
                                <Select
                                    value={priority}
                                    onValueChange={setPriority}
                                    required
                                >
                                    <SelectTrigger
                                        id="priority"
                                        className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500"
                                    >
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="High">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-gray-300"
                                >
                                    Status
                                </Label>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                    required
                                >
                                    <SelectTrigger
                                        id="status"
                                        className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500"
                                    >
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                        <SelectItem value="To Do">
                                            To Do
                                        </SelectItem>
                                        <SelectItem value="In Progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="Done">
                                            Done
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="dueDate"
                                    className="text-gray-300"
                                >
                                    Due Date
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="dueDate"
                                            variant="outline"
                                            className={`w-full justify-start border-gray-700 bg-gray-800 text-left font-normal ${
                                                !dueDate
                                                    ? 'text-gray-500'
                                                    : 'text-gray-200'
                                            }`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate
                                                ? format(dueDate, 'PPP')
                                                : 'Select a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto border-gray-700 bg-gray-800 p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                            className="rounded-md border-gray-700 bg-gray-800 text-gray-200"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="assignedTo"
                                    className="text-gray-300"
                                >
                                    Assigned To
                                </Label>
                                <Select
                                    value={assignedTo}
                                    onValueChange={setAssignedTo}
                                >
                                    <SelectTrigger
                                        id="assignedTo"
                                        className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500"
                                    >
                                        <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                        <SelectItem value="John Doe">
                                            John Doe
                                        </SelectItem>
                                        <SelectItem value="Jane Smith">
                                            Jane Smith
                                        </SelectItem>
                                        <SelectItem value="Alex Johnson">
                                            Alex Johnson
                                        </SelectItem>
                                        <SelectItem value="Sarah Williams">
                                            Sarah Williams
                                        </SelectItem>
                                        <SelectItem value="Michael Brown">
                                            Michael Brown
                                        </SelectItem>
                                        <SelectItem value="Emily Davis">
                                            Emily Davis
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
