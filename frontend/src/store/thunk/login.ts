/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetAccount } from '../slices/accountSlice';
import { resetTasks } from '../slices/taskSlice';
import { resetUsers } from '../slices/userSlice';

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // Dispatch all reset actions
            dispatch(resetAccount());
            dispatch(resetTasks());
            dispatch(resetUsers());

            // No need to return anything for logout
            return;
        } catch (error: any) {
            // Make sure to return the rejected value
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);
