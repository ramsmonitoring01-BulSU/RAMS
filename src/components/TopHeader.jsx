import React from 'react';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function TopHeader({ setIsSidebarOpen }) {
    return (
        <header className="flex justify-between items-center px-4 md:px-8 h-20 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-card-dark shadow-sm z-10 shrink-0 transition-colors duration-300">

            {/* LEFT SIDE: MOBILE MENU & TITLE */}
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden text-slate-500 dark:text-slate-400 hover:text-brand transition-colors"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu size={24} />
                </button>

                <h2 className="text-lg md:text-xl font-display font-bold text-slate-900 dark:text-white transition-colors">
                    RAMS Monitoring
                </h2>
            </div>

            {/* RIGHT SIDE: CONTROLS */}
            <div className="flex items-center gap-4 md:gap-6">

                {/* 1. Your Dark Mode Toggle */}
                <ThemeToggle />

                {/* 2. Your Notification Bell (Safe and Sound!) */}
                <button className="text-slate-400 dark:text-slate-500 hover:text-brand dark:hover:text-brand-light transition-colors relative">
                    <Bell size={22} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-card-dark transition-colors"></span>
                </button>

                {/* 3. Administrator Profile */}
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 cursor-pointer overflow-hidden transition-colors">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Administrator Profile" />
                </div>

            </div>
        </header>
    );
}