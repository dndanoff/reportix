import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './contexts/themeProvider';

export const App = () => {
    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};
