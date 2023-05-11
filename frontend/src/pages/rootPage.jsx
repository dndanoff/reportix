import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/useTheme';
import { ThemeContext } from '../contexts/themeContext';
import { useDisableRightClick } from '../hooks/useDisableRightClick';

export const RootPage = () => {
    const { theme } = useTheme(ThemeContext);
    useDisableRightClick();
    return (
        <div data-bs-theme={theme} className="container">
            <Outlet />
        </div>
    );
};
