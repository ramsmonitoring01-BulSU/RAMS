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
            <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">System Status</span>
                    <Activity size={16} className="text-[#10B981]" />
                </div>
                <div className="text-lg md:text-xl font-display font-bold text-slate-800">Online</div>
            </div>

            {/* CARD 2: Max Depth */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Max Depth</span>
                    <Waves size={16} className="text-[#F59E0B]" />
                </div>
                <div className="text-lg md:text-xl font-mono font-bold text-slate-800">
                    46.5<span className="text-xs font-sans text-slate-500 ml-0.5">cm</span>
                </div>
            </div>

            {/* CARD 3: Safe Routes */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Safe Routes</span>
                    <Route size={16} className="text-[#10B981]" />
                </div>
                <div className="text-lg md:text-xl font-mono font-bold text-slate-800">3 / 4</div>
            </div>

            {/* CARD 4: Last Sync */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Last Sync</span>
                    <RefreshCw size={16} className="text-[#2563EB]" />
                </div>
                <div className="text-lg md:text-xl font-display font-bold text-slate-800">Just Now</div>
            </div>

        </div>
    );
}