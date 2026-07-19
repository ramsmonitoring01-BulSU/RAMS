// ============================================================================
// COMPONENT: Sidebar
// PURPOSE: The main navigation menu on the left side of the screen.
// It handles shrinking on desktop and sliding out on mobile devices.
// ============================================================================

import React from 'react';
import {
    LayoutDashboard, DoorOpen, History, Download,
    Activity, X, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopCollapsed,
    setIsDesktopCollapsed
}) {
    return (
        <>
            {/* MOBILE OVERLAY: The dark transparent background when the menu is open on phones */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* MAIN SIDEBAR CONTAINER */}
            <nav className={`fixed md:relative top-0 left-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64 w-64'}
      `}>

                {/* ========================================= */}
                {/* BRANDING & LOGO SECTION                   */}
                {/* ========================================= */}
                <div className={`flex items-center h-20 px-4 md:px-6 mb-4 border-b border-slate-100 ${isDesktopCollapsed ? 'justify-center' : 'justify-between md:justify-start gap-3'}`}>

                    {/* Logo Icon Box */}
                    <div className="w-10 h-10 min-w-[40px] rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB]">
                        <Activity size={24} strokeWidth={2.5} />
                    </div>

                    {/* Institution Text */}
                    <div className={`overflow-hidden transition-all whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
                        {/* Change the text below to update the dashboard title */}
                        <h1 className="text-lg font-display font-bold tracking-tight" title="Resiliency Energy and Continuity">
                            SmarTech
                        </h1>
                        <p className="text-[10px] font-sans font-semibold text-emerald-600 uppercase tracking-widest">
                            IOT System
                        </p>
                    </div>

                    {/* Close Button for Mobile */}
                    <button className="md:hidden ml-auto text-slate-400" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* ========================================= */}
                {/* NAVIGATION LINKS                          */}
                {/* ========================================= */}
                <ul className="flex flex-col gap-2 flex-grow px-3">
                    <li>
                        {/* The active page has a blue background */}
                        <a href="#" className={`flex items-center gap-3 bg-blue-50 text-[#2563EB] rounded-xl px-3 py-3 transition-all font-sans font-semibold ${isDesktopCollapsed ? 'justify-center' : ''}`}>
                            <LayoutDashboard size={20} className="min-w-[20px]" />
                            <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        {/* Inactive pages have gray text that turns dark on hover */}
                        <a href="#" className={`flex items-center gap-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl px-3 py-3 transition-all font-sans font-medium ${isDesktopCollapsed ? 'justify-center' : ''}`}>
                            <DoorOpen size={20} className="min-w-[20px]" />
                            <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Nodes</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={`flex items-center gap-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl px-3 py-3 transition-all font-sans font-medium ${isDesktopCollapsed ? 'justify-center' : ''}`}>
                            <History size={20} className="min-w-[20px]" />
                            <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>History</span>
                        </a>
                    </li>
                </ul>

                {/* ========================================= */}
                {/* BOTTOM ACTIONS (Export Button)            */}
                {/* ========================================= */}
                <div className="px-3 mt-auto mb-4 flex flex-col gap-2">
                    <button className={`w-full bg-blue-50 text-[#2563EB] font-sans font-semibold text-sm py-3 rounded-xl hover:bg-[#2563EB] hover:text-white transition-colors flex items-center justify-center gap-2 ${isDesktopCollapsed ? 'px-0' : 'px-4'}`}>
                        <Download size={18} />
                        <span className={`whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Export</span>
                    </button>
                </div>

                {/* Desktop Collapse Toggle */}
                <div className="border-t border-slate-100 p-3">
                    <button
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="hidden md:flex w-full items-center justify-center py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </nav>
        </>
    );
}