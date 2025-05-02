import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RootState, useAppSelector } from '@/store/store';
import { IResultModificationData, UPDATES_TYPE } from '@/types';

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

    console.log('acitivities', activities);

    return (
        <ScrollArea className="h-auto pr-4">
            <div className="space-y-6">
                {activities.map((activity: IResultModificationData, key: number) => (
                    <div key={key} className="flex gap-4">
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
