/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    type BaseQueryApi,
    type BaseQueryFn,
    type DefinitionType,
    type FetchArgs,
    type FetchBaseQueryError,
    type QueryReturnValue,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setToken } from '../slices/accountSlice';
import type { RootState } from '../store';
import { logout } from '../thunk/login';

const BACKEND_BASE_URL = 'http://localhost:5000';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: BACKEND_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).user.access_token;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithTimeout: any = async (
    args: any,
    api: any,
    extraOptions: any
) => {
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutDuration = 60000;

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutDuration);

    const result = await baseQuery(args, api, {
        ...extraOptions,
        signal
    });

    clearTimeout(timeoutId);

    return result as QueryReturnValue<
        DefinitionType,
        FetchBaseQueryError,
        object
    >;
};

const baseQueryWithRefreshToken: BaseQueryFn<
    FetchArgs,
    BaseQueryApi,
    DefinitionType
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result: any = await baseQueryWithTimeout(args, api, extraOptions);
    console.log('BACKEND_BASE_URL', BACKEND_BASE_URL);
    if (result?.error?.status === 401) {
        const refreshToken = (api.getState() as RootState).user.refresh_token;
        if (!mutex.isLocked() && refreshToken) {
            const release = await mutex.acquire();

            // send refresh token
            try {
                console.log('Sending refresh token');
                const res = await fetch(BACKEND_BASE_URL, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                });

                const data = await res.json();
                const token = data?.data?.accessToken;

                if (token) {
                    api.dispatch(setToken(token));
                    result = await baseQueryWithTimeout(
                        args,
                        api,
                        extraOptions
                    );
                } else {
                    api.dispatch(logout());
                }
            } catch (err) {
                console.log(err);
                api.dispatch(logout());
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQueryWithTimeout(args, api, extraOptions);
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ['user', 'task'],
    endpoints: () => ({})
});
