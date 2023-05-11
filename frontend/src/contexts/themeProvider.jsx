import { createContext, useState } from 'react';
import { ThemeContext } from './themeContext';

const themes = {
    light: 'light',
    dark: 'dark',
};

export const ThemeProvider = (props) => {
    const [theme, setTheme] = useState(themes.dark);

    const toggleTheme = () => {
        if (theme === themes.dark) {
            setTheme(themes.light);
        } else {
            setTheme(themes.dark);
        }
    };

    const contextValue = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {props.children}
        </ThemeContext.Provider>
    );
};
