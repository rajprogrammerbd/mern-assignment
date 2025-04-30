import { ILoginProps, IRegistrationProps } from '@/types';
import { baseApi } from './baseApi';

const userApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // login
        login: builder.mutation({
            query: (data: ILoginProps) => {
                return {
                    url: '/api/v1/user/login',
                    method: 'POST',
                    body: data
                };
            },
            invalidatesTags: ['user']
        }),
        // register
        register: builder.mutation({
            query: (data: IRegistrationProps) => {
                return {
                    url: '/api/v1/user/register',
                    method: 'POST',
                    body: data
                };
            },
            invalidatesTags: ['user']
        })
    })
});

export const { useRegisterMutation, useLoginMutation } = userApi;

export default userApi;
