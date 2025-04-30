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
import { useAddTaskMutation } from '@/store/api/taskApi';
import { RootState, useAppSelector } from '@/store/store';
import { Priority, PriorityType, Status, StatusType } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewTaskPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<PriorityType>(Priority.Low);

    const user = useAppSelector((state: RootState) => state.user.user);
    const { allUsers } = useAppSelector((state: RootState) => state.allUsers);

    const [status, setStatus] = useState<StatusType>(Status.ToDo);
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [assignedTo, setAssignedTo] = useState<string>('');

    const [addTask, { isLoading }] = useAddTaskMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim() === '') {
            toast.error('Title is required');
            return;
        } else if (description.trim() === '') {
            toast.error('Description is required');
            return;
        } else if (dueDate === undefined) {
            toast.error('Due date is required');
            return;
        } else if (assignedTo.trim() === '') {
            toast.error('Assigned to is required');
            return;
        }

        addTask({
            title,
            description,
            priority,
            status,
            dueDate: dueDate.toISOString(),
            assignedTo,
            userId: user ? user?.id : ''
        })
            .unwrap()
            .then(() => {
                router.push('/dashboard');
            })
            .catch((er) => console.log('task add error', er));
    };

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
                    Create New Task
                </h1>
            </div>

            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-xl text-white">
                            Task Details
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Fill in the information for your new task
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
                                    onValueChange={(e) =>
                                        setPriority(e as PriorityType)
                                    }
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
                                    onValueChange={(e) =>
                                        setStatus(e as StatusType)
                                    }
                                >
                                    <SelectTrigger
                                        id="status"
                                        className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500"
                                    >
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                        <SelectItem value="ToDo">
                                            To Do
                                        </SelectItem>
                                        <SelectItem value="InProgress">
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
                                        {allUsers.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.username}
                                            </SelectItem>
                                        ))}
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
