'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SocketProvider } from './SocketWrapper';
import { PersistStore, store } from './store';

type Props = {
    children: React.ReactNode;
};

export function ReduxProvider({ children }: Props) {
    return (
        <Provider store={store}>
            <SocketProvider>
                <PersistGate loading={null} persistor={PersistStore}>
                    {children}
                </PersistGate>
            </SocketProvider>
        </Provider>
    );
}
