// ============================================================================
// COMPONENT: Map Widget (Expanded Version)
// PURPOSE: The large container on the left side of the screen that holds
// the interactive campus map.
// ============================================================================

import React from 'react';
import { Map } from 'lucide-react';

export default function MapWidget() {
    return (
        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-full transition-colors duration-300">

            {/* Map Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-card-dark shrink-0 transition-colors">
                <h2 className="text-base font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                    <Map size={18} className="text-[#2563EB] dark:text-brand-light" /> Live Campus Map
                </h2>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] dark:text-emerald-400 text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                </span>
            </div>

            {/* Map Container (Placeholder for Leaflet) */}
            <div className="flex-1 relative bg-slate-100 dark:bg-slate-800/50 w-full h-full flex items-center justify-center transition-colors">
                <span className="text-slate-400 dark:text-slate-300 text-sm font-sans font-bold uppercase tracking-widest bg-white dark:bg-slate-700 px-4 py-2 rounded-lg shadow-sm transition-colors">
                    react-leaflet Map Container
                </span>
            </div>

        </div>
    );
}