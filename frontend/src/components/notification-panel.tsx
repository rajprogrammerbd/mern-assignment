/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle, Clock, Info } from 'lucide-react';

const notifications = [
    {
        id: 1,
        title: 'Task assigned to you',
        description:
            "John Doe assigned you a new task: 'Update user dashboard'",
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        type: 'info',
        read: false
    },
    {
        id: 2,
        title: 'Task status updated',
        description:
            "Task 'Create API documentation' was marked as In Progress",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: 'update',
        read: false
    },
    {
        id: 3,
        title: 'Task completed',
        description: "Task 'Fix login page bug' was marked as Done",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: 'success',
        read: true
    },
    {
        id: 4,
        title: 'Due date approaching',
        description: "Task 'Prepare quarterly report' is due tomorrow",
        time: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        type: 'warning',
        read: true
    },
    {
        id: 5,
        title: 'New comment',
        description: "Jane Smith commented on task 'Implement new feature'",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: 'info',
        read: true
    }
];

export function NotificationPanel() {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">
                    Notifications
                </h2>
                <span className="text-sm text-gray-400">
                    {unreadCount} unread
                </span>
            </div>
            <Tabs defaultValue="all" className="flex-1">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="flex-1">
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <div className="space-y-1 p-4">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="unread" className="flex-1">
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <div className="space-y-1 p-4">
                            {notifications
                                .filter((n) => !n.read)
                                .map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                    />
                                ))}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function NotificationItem({ notification }: { notification: any }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'info':
                return <Info className="h-5 w-5 text-blue-400" />;
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'warning':
                return <Clock className="h-5 w-5 text-yellow-400" />;
            case 'update':
                return <Bell className="h-5 w-5 text-purple-400" />;
            default:
                return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    return (
        <div
            className={`flex cursor-pointer gap-3 rounded-md p-3 transition-colors hover:bg-gray-800 ${
                notification.read ? 'opacity-70' : 'bg-gray-800/50'
            }`}
        >
            <div className="mt-0.5 rounded-full bg-gray-800 p-1">
                {getIcon(notification.type)}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">
                        {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.time, {
                            addSuffix: true
                        })}
                    </span>
                </div>
                <p className="text-sm text-gray-400">
                    {notification.description}
                </p>
            </div>
        </div>
    );
}
