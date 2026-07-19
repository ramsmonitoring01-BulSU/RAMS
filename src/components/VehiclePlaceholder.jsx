// ============================================================================
// COMPONENT: Vehicle Placeholder
// PURPOSE: Displays a single rectangular box indicating if a vehicle can cross.
// It automatically turns GREEN (Pass) or RED (Stop) based on the water level.
// ============================================================================

import React from 'react';

export default function VehiclePlaceholder({ label, maxDepth, currentLevel }) {
    // LOGIC: If the current water level is strictly greater than the vehicle's max depth, it is submerged.
    const isSubmerged = currentLevel > maxDepth;

    return (
        <div className={`p-2 rounded-lg border-2 flex flex-col justify-between h-full transition-colors font-sans ${
            // STYLE LOGIC: If submerged, use red colors. If safe, use green colors.
            // Non-technical users: You can change 'rose' to 'red' or 'emerald' to 'green' if you prefer standard tailwind colors.
            isSubmerged
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>

            {/* TOP SECTION: Vehicle Name and Limit Label */}
            <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    {label} {/* This prints the name, like "E-Trike" */}
                </div>
                <div className="text-[9px] sm:text-[10px] opacity-70 font-medium tracking-wide">
                    Limit: {maxDepth}cm {/* This prints the limit, like "Limit: 20cm" */}
                </div>
            </div>

            {/* BOTTOM SECTION: PASS or STOP text */}
            <div className={`text-xs sm:text-sm font-display font-bold mt-2 ${isSubmerged ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                {isSubmerged ? 'STOP' : 'PASS'}
            </div>

        </div>
    );
}