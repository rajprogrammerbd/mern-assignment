import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE
} from 'redux-persist';
import { baseApi } from './api/baseApi';
import { storagePersist } from './persistConfig';
import { accountSlice } from './slices/accountSlice';
import { taskSlice } from './slices/taskSlice';
import { userSlice } from './slices/userSlice';

const rootReducer = combineReducers({
    user: accountSlice.reducer,
    allUsers: userSlice.reducer,
    allTasks: taskSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer
});

const persistConfig = {
    key: 'root',
    storage: storagePersist,
    whitelist: ['user', 'allUsers', 'allTasks']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        }).concat(baseApi.middleware)
});

setupListeners(store.dispatch);

// Typed Hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Persistor
export const PersistStore = persistStore(store);
