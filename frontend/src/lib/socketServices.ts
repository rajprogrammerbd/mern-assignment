import { addAllUser } from '@/store/slices/userSlice';
import { WebSocket_IUser } from './../../../backend/src/types/index';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setSocket } from '@/store/slices/accountSlice';
import {
    addAllTasks,
    addAllTasksHistory,
    addTask,
    addTaskHistory
} from '@/store/slices/taskSlice';
import { AppDispatch } from '@/store/store';
import { logout } from '@/store/thunk/login';
import {
    IResultModificationData,
    IUser,
    Task,
    WEBSOCKET_EVENTS
} from '@/types';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export let socket: Socket | null = null;

/**
 * Emit events to the server
 */
export const emitEvent = (event: WEBSOCKET_EVENTS, payload: any): void => {
    socket?.emit(event, payload);
};

/**
 * Initialize the socket connection and setup listeners
 */
export const connectSocket = (
    dispatch: AppDispatch,
    access_token: string,
    user: IUser
): void => {
    if (!socket) {
        socket = io(SOCKET_SERVER_URL, {
            auth: {
                token: access_token
            }
        });

        // Socket event listeners
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            dispatch(setSocket(true));
        });

        socket.on('all_users', (users: WebSocket_IUser) => {
            console.log('Received all_users event:', users);
            dispatch(addAllUser(users));
        });

        socket.on('connect_error', () => {
            toast.error('Connection Error, please login again');

            dispatch(setSocket(false));
            dispatch(addAllUser([]));
            dispatch(logout());
        });

        socket.on('connect_timeout', () => {
            console.error('Connection Timeout');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            dispatch(setSocket(false));
        });

        socket.on('task-created', (task: Task) => {
            console.log('add a task', task);
            if (task.user.email !== user.email) {
                toast.success('A task has been added');
            }

            dispatch(addTask(task));
        });

        socket.on('all-tasks', (tasks: Task[]) => {
            dispatch(addAllTasks(tasks));
        });

        socket.on(
            'task-deleted',
            (data: { allTasks: Task[]; result: IResultModificationData }) => {
                console.log('task-deleted', data);
                if (user.email !== data.result.newValue.user.email) {
                    toast.success('A task has been deleted');
                }
                dispatch(addAllTasks(data.allTasks));
                dispatch(addTaskHistory(data.result));
            }
        );

        socket.on('task-updated',
            (data: { allTasks: Task[]; result: IResultModificationData }) => {
                console.log('task-updated', data);
                if (user.email !== data.result.newValue.user.email) {
                    toast.success('A task has been updated');
                    dispatch(addAllTasks(data.allTasks));
                }
                dispatch(addTaskHistory(data.result));
            }
        )

        socket.on('all-task-history', (data: IResultModificationData[]) => {
            dispatch(addAllTasksHistory(data));
        });
    }
};

/**
 * Disconnect the socket connection
 */
export const disconnectSocket = (): void => {
    socket?.disconnect();
    socket = null;
    console.log('Socket disconnected');
};
