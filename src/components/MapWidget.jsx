// ============================================================================
// COMPONENT: Map Widget (Expanded Version)
// PURPOSE: The large container on the left side of the screen that holds
// the interactive campus map.
// ============================================================================

import React from 'react';
import { Map } from 'lucide-react';

export default function MapWidget() {
    return (
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-full">

            {/* Map Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <h2 className="text-base font-display font-medium text-slate-800 flex items-center gap-2">
                    <Map size={18} className="text-[#2563EB]" /> Live Campus Map
                </h2>
                <span className="bg-emerald-50 text-[#10B981] text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                </span>
            </div>

            {/* Map Container (Placeholder for Leaflet) */}
            <div className="flex-1 relative bg-slate-100 w-full h-full flex items-center justify-center">
                <span className="text-slate-400 text-sm font-sans font-bold uppercase tracking-widest bg-white px-4 py-2 rounded-lg shadow-sm">
                    react-leaflet Map Container
                </span>
            </div>

        </div>
    );
}