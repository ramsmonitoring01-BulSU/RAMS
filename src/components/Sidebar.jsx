// ============================================================================
// COMPONENT: Sidebar
// PURPOSE: The main navigation menu on the left side of the screen.
// It handles shrinking on desktop and sliding out on mobile devices.
// ============================================================================

import React, { useState } from 'react';
import {
    LayoutDashboard, DoorOpen, History, Download,
    Activity, X, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
// 1. Import Supabase to fetch the export data
import { supabase } from '../supabaseClient';

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    activeView,
    setActiveView
}) {
    // 2. Add a loading state for the export button
    const [isExporting, setIsExporting] = useState(false);

    // 3. The Export Logic
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Fetch the last 1000 telemetry readings
            const { data, error } = await supabase
                .from('gate_telemetry')
                .select('created_at, gate_id, water_level_cm, battery_voltage, status')
                .order('created_at', { ascending: false })
                .limit(1000);

            if (error) throw error;

            if (!data || data.length === 0) {
                alert("No data available to export.");
                setIsExporting(false);
                return;
            }

            // Create CSV Headers
            const headers = ['Timestamp', 'Gate ID', 'Water Level (cm)', 'Battery (V)', 'Status'];

            // Map database rows to CSV format
            const csvRows = data.map(row => {
                // Remove commas from the date string to prevent breaking the CSV columns
                const date = new Date(row.created_at).toLocaleString().replace(/,/g, '');
                return `${date},${row.gate_id},${row.water_level_cm},${row.battery_voltage},${row.status}`;
            });

            // Combine headers and rows with line breaks
            const csvContent = [headers.join(','), ...csvRows].join('\n');

            // Trigger the browser download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `SmarTech_Telemetry_Export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export data. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* MAIN SIDEBAR CONTAINER */}
            <nav className={`fixed md:relative top-0 left-0 h-screen bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64 w-64'}
      `}>

                {/* BRANDING & LOGO SECTION */}
                <div className={`flex items-center h-20 px-4 md:px-6 mb-4 border-b border-slate-100 dark:border-slate-700 transition-colors ${isDesktopCollapsed ? 'justify-center' : 'justify-between md:justify-start gap-3'}`}>
                    <div className="w-10 h-10 min-w-[40px] rounded-lg bg-blue-100 dark:bg-brand-dark/30 flex items-center justify-center text-[#2563EB] dark:text-brand-light transition-colors">
                        <Activity size={24} strokeWidth={2.5} />
                    </div>
                    <div className={`overflow-hidden transition-all whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
                        <h1 className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-white" title="Resiliency Energy and Continuity">
                            SmarTech
                        </h1>
                        <p className="text-[10px] font-sans font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            IOT System
                        </p>
                    </div>
                    <button className="md:hidden ml-auto text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* NAVIGATION LINKS */}
                <ul className="flex flex-col gap-2 flex-grow px-3">
                    <li>
                        <button
                            onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-all font-sans ${activeView === 'dashboard'
                                    ? 'bg-blue-50 dark:bg-brand-dark/20 text-[#2563EB] dark:text-brand-light font-semibold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'
                                } ${isDesktopCollapsed ? 'justify-center' : ''}`}
                        >
                            <LayoutDashboard size={20} className="min-w-[20px]" />
                            <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => { setActiveView('nodes'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-all font-sans ${activeView === 'nodes'
                                    ? 'bg-blue-50 dark:bg-brand-dark/20 text-[#2563EB] dark:text-brand-light font-semibold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'
                                } ${isDesktopCollapsed ? 'justify-center' : ''}`}
                        >
                            <DoorOpen size={20} className="min-w-[20px]" />
                            <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Nodes</span>
                        </button>
                    </li>
                    <li>
                        <a href="#" className={`flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl px-3 py-3 transition-all font-sans font-medium ${isDesktopCollapsed ? 'justify-center' : ''}`}>
                            <History size={20} className="min-w-[20px]" />
                            <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>History</span>
                        </a>
                    </li>
                </ul>

                {/* BOTTOM ACTIONS (Export Button) */}
                <div className="px-3 mt-auto mb-4 flex flex-col gap-2">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`w-full bg-blue-50 dark:bg-brand-dark/20 text-[#2563EB] dark:text-brand-light font-sans font-semibold text-sm py-3 rounded-xl hover:bg-[#2563EB] dark:hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2 ${isDesktopCollapsed ? 'px-0' : 'px-4'} ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {/* Show a spinning icon if exporting, otherwise show the normal download icon */}
                        {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}

                        <span className={`whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </span>
                    </button>
                </div>

                {/* Desktop Collapse Toggle */}
                <div className="border-t border-slate-100 dark:border-slate-700 p-3 transition-colors">
                    <button
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="hidden md:flex w-full items-center justify-center py-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                        {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </nav>
        </>
    );
}