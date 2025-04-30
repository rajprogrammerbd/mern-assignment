import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RootState, useAppSelector } from '@/store/store';
import { IResultModificationData, UPDATES_TYPE } from '@/types';

// const activities = [
// {
//     id: 1,
//     user: {
//         name: 'John Doe',
//         avatar: '/placeholder.svg?height=32&width=32'
//     },
//     action: 'created a new task',
//     target: 'Implement user authentication',
//     time: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
// },
// {
//     id: 2,
//     user: {
//         name: 'Jane Smith',
//         avatar: '/placeholder.svg?height=32&width=32'
//     },
//     action: 'updated the status of',
//     target: 'Design landing page',
//     time: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
// },
// {
//     id: 3,
//     user: {
//         name: 'Alex Johnson',
//         avatar: '/placeholder.svg?height=32&width=32'
//     },
//     action: 'commented on',
//     target: 'Fix navigation bug',
//     time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
// },
// {
//     id: 4,
//     user: {
//         name: 'Sarah Williams',
//         avatar: '/placeholder.svg?height=32&width=32'
//     },
//     action: 'completed',
//     target: 'Update documentation',
//     time: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
// },
// {
//     id: 5,
//     user: {
//         name: 'Michael Brown',
//         avatar: '/placeholder.svg?height=32&width=32'
//     },
//     action: 'assigned',
//     target: 'Optimize database queries',
//     time: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
// },
// {
//     id: 6,
//     user: {
//         name: 'Emily Davis',
//         avatar: '/placeholder.svg?height=32&width=32'
//     },
//     action: 'created a new task',
//     target: 'Implement dark mode',
//     time: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
// }
// ];

const actionMessage = (type: UPDATES_TYPE): string => {
    if (type === 'DELETED') {
        return 'delete a task';
    } else if (type === 'UPDATED') {
        return 'updated a task';
    } else {
        return 'created a task';
    }
};

export function RecentActivity() {
    const activities = useAppSelector(
        (state: RootState) => state.allTasks.taskHistory
    );

    return (
        <ScrollArea className="h-auto pr-4">
            <div className="space-y-6">
                {activities.map((activity: IResultModificationData) => (
                    <div key={activity.taskId} className="flex gap-4">
                        <Avatar className="h-8 w-8 border border-gray-700">
                            <AvatarImage
                                src="/placeholder.svg"
                                alt={`${activity.previousValue.user.username}'s avatar`}
                            />
                            <AvatarFallback className="bg-gray-800 text-xs text-gray-300">
                                {activity.previousValue.user.username
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">
                                    {activity.previousValue.user.username}
                                </span>{' '}
                                {actionMessage(activity.changeType)}{' '}
                                <span className="font-medium text-purple-400">
                                    {activity.newValue.task.title}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
