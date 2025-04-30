'use client';

import {
    connectSocket,
    disconnectSocket,
    emitEvent
} from '@/lib/socketServices';
import React, { useEffect } from 'react';
import { useAllTaskQuery } from './api/taskApi';
import { addAllTasks } from './slices/taskSlice';
import { RootState, useAppDispatch, useAppSelector } from './store';

type Props = {
    children: React.ReactNode;
};

export function SocketProvider({ children }: Props) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.user);

    const { data: allTasks } = useAllTaskQuery({});

    useEffect(() => {
        if (allTasks) {
            dispatch(addAllTasks(allTasks));
        }
    }, [allTasks]);

    useEffect(() => {
        if (user.access_token && user.user) {
            connectSocket(dispatch, user.access_token, user.user);
            // Emit the event to fetch all users
            emitEvent('all_users', {});

            // Get All tasks
            emitEvent('all-tasks', {});

            // Get all tasks history
            emitEvent('all-task-history', {});
        }

        return () => {
            if (user.access_token) {
                disconnectSocket();
            }
        };
    }, [dispatch, user.access_token]);

    return <>{children}</>;
}
