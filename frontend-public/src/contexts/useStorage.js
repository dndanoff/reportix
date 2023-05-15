import { useContext } from 'react';

import { StorageContext } from './storageContext';

export const useStorage = () => {
    const context = useContext(StorageContext);

    if (context === undefined) {
        throw new Error('useSorage must be used within a StorageContext.');
    }

    return context;
};
