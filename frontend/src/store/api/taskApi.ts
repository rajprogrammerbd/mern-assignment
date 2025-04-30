import { ModifiedTask } from '@/types';
import { baseApi } from './baseApi';

const taskApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all tasks
        allTask: builder.query({
            query: () => {
                return {
                    url: '/api/v1/task',
                    method: 'GET'
                };
            },
            providesTags: ['task']
        }),
        // Add a task
        addTask: builder.mutation({
            query: (data: ModifiedTask) => {
                return {
                    url: '/api/v1/task/add',
                    method: 'POST',
                    body: data
                };
            },
            invalidatesTags: ['task']
        }),
        // Delete a task
        deleteTask: builder.mutation({
            query: (taskId: string) => {
                return {
                    url: `/api/v1/task/${taskId}`,
                    method: 'DELETE'
                };
            },
            invalidatesTags: ['task']
        })
    })
});

export const { useAllTaskQuery, useAddTaskMutation, useDeleteTaskMutation } =
    taskApi;

export default taskApi;
