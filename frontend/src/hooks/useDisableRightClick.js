import { useEffect } from 'react';

export const useDisableRightClick = () => {
    useEffect(() => {
        const handleOpenContext = (evt) => {
            evt.preventDefault();
        };

        document.addEventListener('contextmenu', handleOpenContext);
    }, []);
};
