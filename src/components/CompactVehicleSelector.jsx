// Vehicle selector

import React from 'react';
import { User, Car, Bike, Zap } from 'lucide-react';

export default function CompactVehicleSelector({ selectedVehicle, setSelectedVehicle }) {
    const vehicles = [
        { id: 'human', label: 'Walk', icon: User },
        { id: 'ebike', label: 'E-Bike', icon: Zap },
        { id: 'motorbike', label: 'Motor', icon: Bike },
        { id: 'sedan', label: 'Car', icon: Car }
    ];

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700 shadow-sm w-full transition-colors duration-300">
            <h3 className="text-[10px] font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Car size={14} className="text-[#3B82F6]" />
                Select Vehicle
            </h3>

            <div className="grid grid-cols-4 gap-2">
                {vehicles.map(v => {
                    const isSelected = selectedVehicle === v.id;
                    const Icon = v.icon;
                    return (
                        <button
                            key={v.id}
                            onClick={() => setSelectedVehicle(isSelected ? null : v.id)}
                            className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all duration-200 ${isSelected
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/50 dark:text-blue-400 scale-105 shadow-[0_2px_10px_rgba(59,130,246,0.15)]'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-900/50 dark:border-slate-700/50 dark:text-slate-400 hover:dark:bg-slate-800'
                                }`}
                        >
                            <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} className={`mb-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{v.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}