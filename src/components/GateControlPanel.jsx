// ============================================================================
// COMPONENT: Gate Control Panel
// PURPOSE: The 2x2 grid of buttons. Clicking these updates the "activeGate" 
// state, which changes the data shown in the details panel below it.
// ============================================================================

import React from 'react';

export default function GateControlPanel({ gateData, activeGate, setActiveGate }) {
    // We map over numbers 1 to 4 to generate the four buttons automatically
    const gateNumbers = [1, 2, 3, 4];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <h3 className="text-[10px] font-sans font-bold text-slate-500 mb-3 uppercase tracking-wider">Select Node</h3>

            <div className="grid grid-cols-2 gap-3">
                {gateNumbers.map(num => {
                    const gate = gateData[num];
                    const isActive = activeGate === num;

                    // Determine the indicator dot color based on the gate's status
                    let dotColor = 'bg-[#10B981]'; // Default: Green (Passable)
                    if (gate.status === 'Warning') dotColor = 'bg-[#F59E0B]'; // Amber
                    if (gate.status === 'Impassable') dotColor = 'bg-[#F43F5E]'; // Red

                    return (
                        <button
                            key={num}
                            onClick={() => setActiveGate(num)}
                            className={`flex flex-col p-3 md:p-4 rounded-xl transition-all text-left border-2 ${isActive
                                    ? 'bg-blue-50 border-[#2563EB] shadow-sm' // Style for the clicked/active button
                                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50' // Style for inactive buttons
                                }`}
                        >
                            <div className="flex justify-between items-center w-full mb-2">
                                <span className={`text-sm font-display font-bold tracking-wide ${isActive ? 'text-[#2563EB]' : 'text-slate-600'}`}>
                                    {gate.name}
                                </span>
                                {/* The colored status dot */}
                                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                            </div>

                            <span className="text-lg md:text-xl font-mono font-bold text-slate-800">
                                {gate.level}<span className="text-[10px] md:text-xs font-sans text-slate-500 ml-0.5">cm</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}