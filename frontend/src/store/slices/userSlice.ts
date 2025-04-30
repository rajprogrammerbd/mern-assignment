import { WebSocket_IUser } from '@/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

type TState = {
    allUsers: WebSocket_IUser;
};

const initialState: TState = {
    allUsers: []
};

//carts slice
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addAllUser: (state, action: PayloadAction<WebSocket_IUser>) => {
            state.allUsers = action.payload;
        },
        resetUsers: (state) => {
            state.allUsers = [];
        }
    }
});

export const { addAllUser, resetUsers } = userSlice.actions;

export default userSlice.reducer;
