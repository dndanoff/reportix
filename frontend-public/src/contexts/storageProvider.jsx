import { useState } from 'react';
import { StorageContext } from './storageContext';

export const StorageProvider = (props) => {
    const [storage, setStorage] = useState({});

    const contextValue = {
        storage,
        setStorage,
    };

    return (
        <StorageContext.Provider value={contextValue}>
            {props.children}
        </StorageContext.Provider>
    );
};
