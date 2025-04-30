import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface TaskStatsProps {
    title: string;
    value: number;
    icon: LucideIcon;
    description: string;
    trend?: {
        value: string;
        label: string;
    };
    className?: string;
}

export function TaskStats({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className
}: TaskStatsProps) {
    return (
        <Card className={className}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-white">{value}</p>
                    </div>
                    <div className="rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2">
                        <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{description}</p>
                    {trend && (
                        <p
                            className={`text-xs font-medium ${trend.value.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
                        >
                            {trend.value}{' '}
                            <span className="text-gray-500">{trend.label}</span>
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
