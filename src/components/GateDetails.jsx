// ============================================================================
// COMPONENT: Gate Details
// PURPOSE: Shows the expanded information (Battery, Ping) for the currently 
// selected gate, along with the Vehicle Passability visualizers.
// ============================================================================

import React from 'react';
import { Battery, Wifi } from 'lucide-react';
import VehiclePlaceholder from './VehiclePlaceholder';

export default function GateDetails({ currentGate }) {
    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex-1 flex flex-col transition-colors duration-300">

            {/* HEADER INFO */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-700 transition-colors">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white">{currentGate.name} Data</h3>
                    <p className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-1 tracking-wide">{currentGate.location} Node</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-mono font-bold text-slate-800 dark:text-white tracking-tight">
                        {currentGate.level}<span className="text-sm font-sans text-slate-500 dark:text-slate-400 ml-1">cm</span>
                    </span>
                </div>
            </div>

            {/* TELEMETRY ROW */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700 transition-colors">
                    <span className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Battery size={14} /> Voltage
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{currentGate.battery}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700 transition-colors">
                    <span className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Wifi size={14} /> Latency
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{currentGate.ping}</span>
                </div>
            </div>

            {/* VEHICLE PASSABILITY VISUALIZER */}
            <div className="flex-1 flex flex-col">
                <h4 className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Vehicle Passability Status
                </h4>

                <div className="grid grid-cols-5 gap-2 md:gap-3 flex-1 min-h-[100px]">
                    <VehiclePlaceholder label="Human" maxDepth={15} currentLevel={currentGate.level} />
                    <VehiclePlaceholder label="E-Trike" maxDepth={20} currentLevel={currentGate.level} />
                    <VehiclePlaceholder label="Trike" maxDepth={25} currentLevel={currentGate.level} />
                    <VehiclePlaceholder label="Motorbike" maxDepth={35} currentLevel={currentGate.level} />
                    <VehiclePlaceholder label="Sedan" maxDepth={45} currentLevel={currentGate.level} />
                </div>
            </div>

        </div>
    );
}