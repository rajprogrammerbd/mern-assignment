'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteTaskMutation } from '@/store/api/taskApi';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Trash, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TaskTableProps {
    tasks: Task[];
}

// Utility functions to map types to classes
// const getStatusBadgeStyle = (status: string) => {
//   switch (status) {
//     case 'To Do':
//       return 'border-blue-800 bg-blue-900/30 text-blue-300';
//     case 'In Progress':
//       return 'border-purple-800 bg-purple-900/30 text-purple-300';
//     case 'Done':
//       return 'border-green-800 bg-green-900/30 text-green-300';
//     default:
//       return 'border-gray-800 bg-gray-900/30 text-gray-300';
//   }
// };

// const getPriorityBadgeStyle = (priority: string) => {
//   switch (priority) {
//     case 'High':
//       return 'border-red-800 bg-red-900/30 text-red-300';
//     case 'Medium':
//       return 'border-yellow-800 bg-yellow-900/30 text-yellow-300';
//     case 'Low':
//       return 'border-green-800 bg-green-900/30 text-green-300';
//     default:
//       return 'border-gray-800 bg-gray-900/30 text-gray-300';
//   }
// };

export function TaskTable({ tasks }: TaskTableProps) {
    const router = useRouter();
    const [deleteTask, { isLoading }] = useDeleteTaskMutation();
    const { toast } = useToast();

    const handleDelete = async (taskId: string) => {
        if (isLoading) return;

        await deleteTask(taskId)
            .unwrap()
            .then(() => {
                toast({
                    title: 'Task deleted',
                    description: 'The task has been successfully deleted'
                });
            })
            .catch((er) => {
                toast({
                    description: er.data.message || 'Failed to delete task'
                });
            });
    };

    if (tasks.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-700 p-4 text-center">
                <p className="text-gray-400">No tasks found</p>
                <Link
                    href="/dashboard/new"
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                >
                    Create a new task
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-gray-800">
            <Table>
                <TableHeader className="bg-gray-900/50">
                    <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className="text-gray-400">Title</TableHead>
                        <TableHead className="text-gray-400">
                            Description
                        </TableHead>
                        <TableHead className="hidden text-gray-400 md:table-cell">
                            Status
                        </TableHead>
                        <TableHead className="hidden text-gray-400 md:table-cell">
                            Priority
                        </TableHead>
                        <TableHead className="hidden text-gray-400 md:table-cell">
                            Due Date
                        </TableHead>
                        <TableHead className="hidden text-gray-400 md:table-cell">
                            Assigned To
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task, key) => (
                        <TableRow
                            key={key}
                            className="border-gray-800 hover:bg-gray-800/50"
                        >
                            {/* Title */}
                            <TableCell className="font-medium text-white">
                                <span className="hover:text-purple-300">
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-2 md:hidden">
                                    {/* Show Status and Priority badges in mobile view */}
                                    <Badge
                                        variant="outline"
                                        className={`
              ${task.status === 'ToDo' ? 'border-blue-800 bg-blue-900/30 text-blue-300' : ''}
              ${task.status === 'InProgress' ? 'border-purple-800 bg-purple-900/30 text-purple-300' : ''}
              ${task.status === 'Done' ? 'border-green-800 bg-green-900/30 text-green-300' : ''}
            `}
                                    >
                                        {task.status}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`
              ${task.priority === 'High' ? 'border-red-800 bg-red-900/30 text-red-300' : ''}
              ${task.priority === 'Medium' ? 'border-yellow-800 bg-yellow-900/30 text-yellow-300' : ''}
              ${task.priority === 'Low' ? 'border-green-800 bg-green-900/30 text-green-300' : ''}
            `}
                                    >
                                        {task.priority}
                                    </Badge>
                                </div>
                            </TableCell>

                            {/* Description */}
                            <TableCell className="text-gray-300">
                                {task.description}
                            </TableCell>

                            {/* Status */}
                            <TableCell className="hidden md:table-cell">
                                <Badge
                                    variant="outline"
                                    className={`
            ${task.status === 'ToDo' ? 'border-blue-800 bg-blue-900/30 text-blue-300' : ''}
            ${task.status === 'InProgress' ? 'border-purple-800 bg-purple-900/30 text-purple-300' : ''}
            ${task.status === 'Done' ? 'border-green-800 bg-green-900/30 text-green-300' : ''}
          `}
                                >
                                    {task.status}
                                </Badge>
                            </TableCell>

                            {/* Priority */}
                            <TableCell className="hidden md:table-cell">
                                <Badge
                                    variant="outline"
                                    className={`
            ${task.priority === 'High' ? 'border-red-800 bg-red-900/30 text-red-300' : ''}
            ${task.priority === 'Medium' ? 'border-yellow-800 bg-yellow-900/30 text-yellow-300' : ''}
            ${task.priority === 'Low' ? 'border-green-800 bg-green-900/30 text-green-300' : ''}
          `}
                                >
                                    {task.priority}
                                </Badge>
                            </TableCell>

                            {/* Due Date */}
                            <TableCell className="hidden text-gray-300 md:table-cell">
                                {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </TableCell>

                            {/* Assigned To */}
                            <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage
                                            src="/placeholder.svg?height=24&width=24"
                                            alt={task.assignedUser.username}
                                        />
                                        <AvatarFallback className="bg-gray-800 text-xs text-gray-300">
                                            {task.assignedUser.username
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-gray-300">
                                        {task.assignedUser.username}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Actions (Dropdown) */}
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-white"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="border-gray-800 bg-gray-900 text-gray-300"
                                    >
                                        <DropdownMenuItem
                                            className="hover:bg-gray-800 hover:text-white"
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/edit/${task.id}`
                                                )
                                            }
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="hover:bg-gray-800 hover:text-white"
                                            onClick={() => {}}
                                        >
                                            <Users className="mr-2 h-4 w-4" />
                                            Assign
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-400 hover:bg-red-950 hover:text-red-300"
                                            onClick={() =>
                                                handleDelete(task.id)
                                            }
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
