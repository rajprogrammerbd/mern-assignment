import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface TaskListProps {
    tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
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
        <div className="space-y-3">
            {tasks.map((task) => (
                <Card
                    key={task.id}
                    className="border-gray-800 bg-gray-800/50 hover:bg-gray-800/80"
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id={`task-${task.id}`}
                                className="mt-1 border-gray-600 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                                checked={task.status === 'Done'}
                            />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/dashboard/${task.id}`}
                                        className="text-base font-medium text-white hover:text-purple-300"
                                    >
                                        {task.title}
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-white"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                            More options
                                        </span>
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {task.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
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
                                    <span className="text-xs text-gray-500">
                                        Due{' '}
                                        {formatDistanceToNow(
                                            new Date(task.dueDate),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
