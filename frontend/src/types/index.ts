export interface IToken {
    access_token: string;
    refresh_token: string;
}

export interface IUser {
    id: string;
    username: string;
    email: string;
}

export interface IRegistrationProps {
    username: string;
    email: string;
    password: string;
}

export interface ILoginProps {
    email: string;
    password: string;
}

export interface ILoginUserResponse {
    token: IToken;
    user: IUser;
}

export interface IError {
    status: number;
    data: {
        error: boolean;
        message: string;
    };
}

export type WEBSOCKET_EVENTS =
    | 'all_users'
    | 'task-created'
    | 'task-updated'
    | 'task-deleted'
    | 'all-tasks'
    | 'all-task-history';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TaskHistory {
    id: string;
    taskId: string;
    changeType: string;
    previousValue: any;
    newValue: any;
    timestamp: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

export type WebSocket_IUser = IUser[];

export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export type PriorityType = (typeof Priority)[keyof typeof Priority];

export enum Status {
    ToDo = 'ToDo',
    InProgress = 'InProgress',
    Done = 'Done'
}

export type StatusType = (typeof Status)[keyof typeof Status];

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: string;
    userId: string;
    assignedUser: {
        username: string;
        id: string;
    };
    user: {
        id: string;
        email: string;
    };
}

export interface ModifiedTask
    extends Omit<Task, 'assignedUser' | 'assignedTo' | 'id' | 'user'> {
    assignedTo: string;
}

export interface IResultModificationData {
    taskId: string;
    changeType: 'DELETED' | 'UPDATED' | 'CREATED';
    previousValue: {
        user: IUser;
        task: Task;
    };
    newValue: {
        user: IUser;
        task: Task;
    };
}

export type UPDATES_TYPE = 'DELETED' | 'UPDATED' | 'CREATED';
