import { IResultModificationData, Task } from '@/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

type TState = {
    allTasks: Task[];
    taskHistory: IResultModificationData[];
};

const initialState: TState = {
    allTasks: [],
    taskHistory: []
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addAllTasks: (state, action: PayloadAction<Task[]>) => {
            state.allTasks = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.allTasks.push(action.payload);
        },
        addAllTasksHistory: (
            state,
            action: PayloadAction<IResultModificationData[]>
        ) => {
            state.taskHistory = action.payload;
        },
        addTaskHistory: (
            state,
            action: PayloadAction<IResultModificationData>
        ) => {
            state.taskHistory.push(action.payload);
        },
        resetTasks: (state) => {
            state.allTasks = [];
            state.taskHistory = [];
        }
    }
});

export const {
    addAllTasks,
    addTask,
    addAllTasksHistory,
    addTaskHistory,
    resetTasks
} = taskSlice.actions;

export default taskSlice.reducer;
