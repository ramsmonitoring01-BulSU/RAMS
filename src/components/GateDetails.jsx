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
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex-1 flex flex-col">

            {/* ========================================= */}
            {/* HEADER INFO: Gate Name & Main Water Level */}
            {/* ========================================= */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-800">{currentGate.name} Data</h3>
                    <p className="text-xs font-sans font-medium text-slate-500 mt-1 tracking-wide">{currentGate.location} Node</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-mono font-bold text-slate-800 tracking-tight">
                        {currentGate.level}<span className="text-sm font-sans text-slate-500 ml-1">cm</span>
                    </span>
                </div>
            </div>

            {/* ========================================= */}
            {/* TELEMETRY ROW: Battery & Latency          */}
            {/* ========================================= */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Battery size={14} /> Voltage
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-700">{currentGate.battery}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Wifi size={14} /> Latency
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-700">{currentGate.ping}</span>
                </div>
            </div>

            {/* ========================================= */}
            {/* VEHICLE PASSABILITY VISUALIZER            */}
            {/* ========================================= */}
            <div className="flex-1 flex flex-col">
                <h4 className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Vehicle Passability Status
                </h4>

                {/* We inject the VehiclePlaceholder component 5 times here, passing the current gate's water level to each one */}
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