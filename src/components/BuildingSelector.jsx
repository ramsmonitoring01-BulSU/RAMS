//Dropdown menu for the bldg selector

import React from 'react';
import { MapPin } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../utils/buildings';

export default function BuildingSelector({ selectedBuilding, setSelectedBuilding }) {
    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm w-full transition-colors duration-300">
            <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-[#3B82F6]" />
                Where are you right now?
            </h3>

            <div className="relative">
                <select
                    value={selectedBuilding || ''}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg px-4 py-3 outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-all cursor-pointer"
                >
                    <option value="" disabled>Select your building...</option>
                    {CAMPUS_BUILDINGS.map(bldg => (
                        <option key={bldg.id} value={bldg.id}>
                            {bldg.name}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    );
}