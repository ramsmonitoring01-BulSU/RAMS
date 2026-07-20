import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Toggle Dark Mode"
        >
            {isDarkMode ? (
                <Sun className="w-5 h-5 transition-transform duration-300 rotate-0" />
            ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 -rotate-12" />
            )}
        </button>
    );
};

export default ThemeToggle;