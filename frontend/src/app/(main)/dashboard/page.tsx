/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { RecentActivity } from '@/components/recent-activity';
import { TaskTable } from '@/components/task-table';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { RootState, useAppSelector } from '@/store/store';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Calendar, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const tasks = useAppSelector((state: RootState) => state.allTasks.allTasks);
    const users = useAppSelector((state: RootState) => state.user);

    const filteredTasks = tasks.filter((task: Task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority =
            priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesStatus =
            statusFilter === 'all' || task.status === statusFilter;

        const matchesDate =
            !date ||
            new Date(task.dueDate).toDateString() === date.toDateString();

        return matchesSearch && matchesPriority && matchesStatus && matchesDate;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">
                        Tasks
                    </h1>
                    <p className="text-gray-400">
                        Manage and organize your tasks
                    </p>
                </div>
                <Button
                    asChild
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                    <Link href="/dashboard/new">
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Link>
                </Button>
            </div>

            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-white">
                        Task List
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        View, filter, and manage all your tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 grid gap-4 md:grid-cols-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search tasks..."
                                className="border-gray-700 bg-gray-800 pl-8 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            value={priorityFilter}
                            onValueChange={setPriorityFilter}
                        >
                            <SelectTrigger className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                <SelectItem value="all">
                                    All Priorities
                                </SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="border-gray-700 bg-gray-800 text-gray-200 focus:border-purple-500">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`border-gray-700 bg-gray-800 text-left font-normal ${
                                        !date
                                            ? 'text-gray-500'
                                            : 'text-gray-200'
                                    }`}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {date
                                        ? format(date, 'PPP')
                                        : 'Filter by date'}
                                    {date && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-auto h-4 w-4 text-gray-400 hover:text-gray-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDate(undefined);
                                            }}
                                        >
                                            ×
                                        </Button>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto border-gray-700 bg-gray-800 p-0">
                                <CalendarComponent
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    className="rounded-md border-gray-700 bg-gray-800 text-gray-200"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <TaskTable tasks={filteredTasks} />

                    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-7">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl text-white">
                                Recent Activity
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Latest updates and changes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {users && <RecentActivity />}
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
