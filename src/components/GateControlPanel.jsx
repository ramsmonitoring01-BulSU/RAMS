// ============================================================================
// COMPONENT: Gate Control Panel
// PURPOSE: The 2x2 grid of buttons. Clicking these updates the "activeGate" 
// state, which changes the data shown in the details panel below it.
// ============================================================================

import React from 'react';

export default function GateControlPanel({ gateData, activeGate, setActiveGate }) {
    const gateNumbers = [1, 2, 3, 4];

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
            <h3 className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Select Node</h3>

            <div className="grid grid-cols-2 gap-3">
                {gateNumbers.map(num => {
                    const gate = gateData[num];
                    const isActive = activeGate === num;

                    let dotColor = 'bg-[#10B981]'; // Default: Green (Passable)
                    if (gate.status === 'Warning') dotColor = 'bg-[#F59E0B]'; // Amber
                    if (gate.status === 'Impassable') dotColor = 'bg-[#F43F5E]'; // Red

                    return (
                        <button
                            key={num}
                            onClick={() => setActiveGate(num)}
                            className={`flex flex-col p-3 md:p-4 rounded-xl transition-all text-left border-2 ${isActive
                                ? 'bg-blue-50 dark:bg-brand-dark/20 border-[#2563EB] dark:border-brand shadow-sm'
                                : 'bg-white dark:bg-card-dark border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <div className="flex justify-between items-center w-full mb-2">
                                <span className={`text-sm font-display font-bold tracking-wide ${isActive ? 'text-[#2563EB] dark:text-brand-light' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {gate.name}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                            </div>

                            <span className="text-lg md:text-xl font-mono font-bold text-slate-800 dark:text-white">
                                {gate.level}<span className="text-[10px] md:text-xs font-sans text-slate-500 dark:text-slate-400 ml-0.5">cm</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}