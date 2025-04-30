import storage from 'redux-persist/lib/storage';

const isServer = typeof window === 'undefined';

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem() {
            return Promise.resolve();
        },
        removeItem() {
            return Promise.resolve();
        }
    };
};

export const storagePersist = isServer ? createNoopStorage() : storage;
