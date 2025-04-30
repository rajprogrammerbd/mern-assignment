import { ILoginUserResponse } from '@/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

type TProfile = {
    id: string;
    username: string;
    email: string;
};

type TState = {
    access_token: string | null;
    refresh_token: string | null;
    user: null | TProfile;
    socket: boolean;
};

const initialState: TState = {
    user: null,
    access_token: null,
    refresh_token: null,
    socket: false
};

//carts slice
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<ILoginUserResponse>) => {
            const { user, token } = action.payload;

            state.user = user;
            state.access_token = token.access_token;
            state.refresh_token = token.refresh_token;
        },
        resetAccount: (state) => {
            state.access_token = null;
            state.refresh_token = null;
            state.user = null;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.access_token = action.payload;
        },
        setSocket: (state, action: PayloadAction<boolean>) => {
            state.socket = action.payload;
        }
    }
});

export const { login, resetAccount, setToken, setSocket } =
    accountSlice.actions;

export default accountSlice.reducer;
