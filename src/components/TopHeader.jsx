// 1. Import useEffect and useRef
import React, { useEffect, useRef } from 'react';
import { Menu, Bell, Activity, Waves, Route, RefreshCw } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useNotification } from './NotificationContext';

export default function TopHeader({ setIsSidebarOpen, gateData }) {
    // 2. Destructure our new addNotification function
    const { toggleDrawer, unreadCount, addNotification } = useNotification();

    // 3. Keep track of what the gate statuses were previously
    const prevStatusRef = useRef({});

    // ========================================================================
    // LIVE ALERT ENGINE
    // Monitors the telemetry stream and fires notifications on status changes
    // ========================================================================
    useEffect(() => {
        if (!gateData) return;

        Object.values(gateData).forEach(gate => {
            const prevStatus = prevStatusRef.current[gate.id];

            // If the status has changed to a dangerous state since the last render
            if (prevStatus && prevStatus !== gate.status) {

                if (gate.status === 'Warning') {
                    addNotification({
                        gateId: gate.id,
                        type: 'warning',
                        title: `${gate.name} Water Level Rising`,
                        message: `Depth has reached ${gate.level}cm. Status upgraded to Warning.`
                    });
                }
                else if (gate.status === 'Impassable') {
                    addNotification({
                        gateId: gate.id,
                        type: 'critical',
                        title: `${gate.name} is Impassable!`,
                        message: `Critical depth at ${gate.level}cm. Exceeds safe clearance for vehicles.`
                    });
                }
            }

            // Save current status for the next comparison
            prevStatusRef.current[gate.id] = gate.status;
        });
    }, [gateData, addNotification]); // Runs every time Supabase pushes new gateData

    // ========================================================================
    // DYNAMIC METRICS CALCULATION
    // ========================================================================
    const gates = gateData ? Object.values(gateData) : [];
    const maxDepth = gates.length > 0 ? Math.max(...gates.map(g => g.level)) : 0;
    const safeCount = gates.filter(g => g.status === 'Safe').length;
    const totalGates = gates.length;

    return (
        <header className="flex justify-between items-center px-3 md:px-8 h-20 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-card-dark shadow-sm z-10 shrink-0 transition-colors duration-300 gap-3 md:gap-4 w-full">

            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <button
                    className="md:hidden text-slate-500 dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-brand-light transition-colors"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu size={24} />
                </button>
                <h2 className="hidden md:block text-lg md:text-xl font-display font-bold text-slate-900 dark:text-white transition-colors">
                    RAMS Monitoring
                </h2>
            </div>

            <div
                className="flex-1 flex items-center gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

                {/* System Status */}
                <div className="no-scrollbar shrink-0 snap-start bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 md:gap-3 shadow-sm transition-colors">
                    <Activity size={14} className="text-[#10B981] md:w-4 md:h-4" />
                    <div>
                        <div className="text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">Status</div>
                        <div className="text-[10px] md:text-xs font-display font-bold text-slate-800 dark:text-white">Online</div>
                    </div>
                </div>

                {/* LIVE METRIC 1: Max Depth */}
                <div className="shrink-0 snap-start bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 md:gap-3 shadow-sm transition-colors">
                    <Waves size={14} className="text-[#F59E0B] md:w-4 md:h-4" />
                    <div>
                        <div className="text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">Max Depth</div>
                        <div className="text-[10px] md:text-xs font-mono font-bold text-slate-800 dark:text-white">
                            {maxDepth} <span className="text-[8px] md:text-[9px] font-sans text-slate-400">cm</span>
                        </div>
                    </div>
                </div>

                {/* LIVE METRIC 2: Safe Routes */}
                <div className="shrink-0 snap-start bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 md:gap-3 shadow-sm transition-colors">
                    <Route size={14} className="text-[#10B981] md:w-4 md:h-4" />
                    <div>
                        <div className="text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">Safe Routes</div>
                        <div className="text-[10px] md:text-xs font-mono font-bold text-slate-800 dark:text-white">
                            {safeCount} / {totalGates}
                        </div>
                    </div>
                </div>

                {/* Last Sync */}
                <div className="shrink-0 snap-start bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 md:gap-3 shadow-sm transition-colors">
                    <RefreshCw size={14} className="text-[#2563EB] md:w-4 md:h-4" />
                    <div>
                        <div className="text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">Last Sync</div>
                        <div className="text-[10px] md:text-xs font-display font-bold text-slate-800 dark:text-white">Live</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6 shrink-0 ml-auto pl-2">
                <ThemeToggle />
                <button
                    onClick={toggleDrawer}
                    className="text-slate-400 dark:text-slate-500 hover:text-[#2563EB] dark:hover:text-brand-light transition-colors relative"
                >
                    <Bell size={20} className="md:w-5 md:h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-card-dark transition-colors"></span>
                    )}
                </button>
            </div>

        </header>
    );
}