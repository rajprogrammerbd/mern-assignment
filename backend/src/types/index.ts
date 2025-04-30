/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JwtPayload {
  id: string;
  email: string;
}

export interface ICreateUserProperties {
  username: string;
  email: string;
  password: string;
}

export interface ILoginUserProperties {
  email: string;
  password: string;
}

export interface IToken {
  access_token: string;
  refresh_token: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface ILoginUserResponse {
  token: IToken;
  user: IUser;
}

export type WebSocket_IUser = IUser[];

export type WEBSOCKET_EVENTS =
  | 'all_users'
  | 'task-created'
  | 'task-updated'
  | 'task-deleted'
  | 'all-tasks';

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum Status {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface CreateTaskRequestBody {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  userId: string;
  assignedTo: {
    username: string;
    id: string;
  };
}

export type CHANGE_TYPE = 'DELETED' | 'UPDATED' | 'CREATED';

export interface IResultModificationData {
  taskId: string;
  changeType: CHANGE_TYPE;
  previousValue: {
    user: IUser;
    task: CreateTaskRequestBody;
  };
  newValue: {
    user: IUser;
    task: CreateTaskRequestBody;
  };
}
export type IPriority = 'Low' | 'Medium' | 'High';
export type IStatus = 'ToDo' | 'InProgress' | 'Done';

export interface ITaskUpdatedEvent {
  taskId: string;
  fieldChange: {
    [key: string]: any;
  };
  userId: string;
}