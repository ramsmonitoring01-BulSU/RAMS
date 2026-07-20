// ============================================================================
// COMPONENT: Summary Cards (Compact Version)
// PURPOSE: Displays the 4 critical metrics in a 2x2 grid above the Gate Controls.
// ============================================================================

import React from 'react';
import { Activity, Waves, Route, RefreshCw } from 'lucide-react';

export default function SummaryCards() {
    return (
        <div className="grid grid-cols-2 gap-3">

            {/* CARD 1: System Status */}
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Status</span>
                    <Activity size={16} className="text-[#10B981] dark:text-emerald-400" />
                </div>
                <div className="text-lg md:text-xl font-display font-bold text-slate-800 dark:text-white">Online</div>
            </div>

            {/* CARD 2: Max Depth */}
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Max Depth</span>
                    <Waves size={16} className="text-[#F59E0B] dark:text-amber-400" />
                </div>
                <div className="text-lg md:text-xl font-mono font-bold text-slate-800 dark:text-white">
                    46.5<span className="text-xs font-sans text-slate-500 dark:text-slate-400 ml-0.5">cm</span>
                </div>
            </div>

            {/* CARD 3: Safe Routes */}
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Safe Routes</span>
                    <Route size={16} className="text-[#10B981] dark:text-emerald-400" />
                </div>
                <div className="text-lg md:text-xl font-mono font-bold text-slate-800 dark:text-white">3 / 4</div>
            </div>

            {/* CARD 4: Last Sync */}
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Sync</span>
                    <RefreshCw size={16} className="text-[#2563EB] dark:text-brand-light" />
                </div>
                <div className="text-lg md:text-xl font-display font-bold text-slate-800 dark:text-white">Just Now</div>
            </div>

        </div>
    );
}