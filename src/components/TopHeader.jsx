// ============================================================================
// COMPONENT: Top Header
// PURPOSE: Displays the top bar containing the system name, notification bell,
// and the user profile avatar.
// ============================================================================

import React from 'react';
import { Menu, Bell } from 'lucide-react';

export default function TopHeader({ setIsSidebarOpen }) {
    return (
        <header className="flex justify-between items-center px-4 md:px-8 h-20 border-b border-slate-200 bg-white shadow-sm z-10 shrink-0">

            {/* ========================================= */}
            {/* MOBILE MENU TOGGLE & PAGE TITLE           */}
            {/* ========================================= */}
            <div className="flex items-center gap-4">
                {/* Hamburger menu button (Only visible on small screens) */}
                <button
                    className="md:hidden text-slate-500 hover:text-[#2563EB]"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Change "RAMS Monitoring" to adjust the top bar title */}
                <h2 className="text-lg md:text-xl font-display font-bold text-[#1E293B]">
                    RAMS Monitoring
                </h2>
            </div>

            {/* ========================================= */}
            {/* RIGHT SIDE CONTROLS (Notifications & Profile) */}
            {/* ========================================= */}
            <div className="flex items-center gap-4 md:gap-6">

                {/* Notification Bell */}
                <button className="text-slate-400 hover:text-[#2563EB] transition-colors relative">
                    <Bell size={22} />
                    {/* The red dot indicator for active alerts */}
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Administrator Profile Picture */}
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 border-2 border-slate-300 cursor-pointer overflow-hidden">
                    {/* Replace the 'src' link below with a direct URL to your own logo or profile picture */}
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Administrator Profile" />
                </div>

            </div>
        </header>
    );
}