// ============================================================================
// COMPONENT: Vehicle Placeholder
// PURPOSE: Displays a single rectangular box indicating if a vehicle can cross.
// It automatically turns GREEN (Pass) or RED (Stop) based on the water level.
// ============================================================================

import React from 'react';

export default function VehiclePlaceholder({ label, maxDepth, currentLevel }) {
    const isSubmerged = currentLevel > maxDepth;

    return (
        <div className={`p-2 rounded-lg border-2 flex flex-col justify-between h-full transition-colors font-sans ${isSubmerged
                ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400'
                : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
            }`}>

            <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    {label}
                </div>
                <div className="text-[9px] sm:text-[10px] opacity-70 font-medium tracking-wide">
                    Limit: {maxDepth}cm
                </div>
            </div>

            <div className={`text-xs sm:text-sm font-display font-bold mt-2 transition-colors ${isSubmerged ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'
                }`}>
                {isSubmerged ? 'STOP' : 'PASS'}
            </div>

        </div>
    );
}