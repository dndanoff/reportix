import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { StorageProvider, ThemeProvider } from './contexts';

export const App = () => {
    return (
        <ThemeProvider>
            <StorageProvider>
                <RouterProvider router={router} />
            </StorageProvider>
        </ThemeProvider>
    );
};
