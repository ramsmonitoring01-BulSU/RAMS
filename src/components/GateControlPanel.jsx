import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function GateControlPanel({ gateData, originGate, destinationGate, handleGateClick }) {
    const gateNumbers = [1, 2, 3, 4];

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300 w-full h-[340px] min-h-[340px] max-h-[340px] overflow-hidden flex flex-col">

            <h3 className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider shrink-0">
                Select Route (Tap 2 Nodes)
            </h3>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gateNumbers.map(num => {
                    const gate = gateData[num];
                    if (!gate) return null;

                    const isOrigin = originGate === num;
                    const isDestination = destinationGate === num;

                    let dotColor = 'bg-[#10B981]';
                    let dotPulse = '';

                    if (gate.status === 'Warning') {
                        dotColor = 'bg-[#F59E0B]';
                        dotPulse = 'animate-pulse';
                    }
                    if (gate.status === 'Impassable') {
                        dotColor = 'bg-[#F43F5E]';
                        dotPulse = 'animate-pulse';
                    }

                    let borderStyle = 'border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-card-dark hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                    if (isOrigin) borderStyle = 'bg-blue-50 dark:bg-blue-900/20 border-[#2563EB] shadow-sm';
                    if (isDestination) borderStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-[#10B981] shadow-sm';

                    return (
                        <button
                            key={num}
                            onClick={() => handleGateClick(num)}
                            className={`flex flex-col items-start gap-1 p-4 md:p-5 rounded-xl transition-all text-left border-2 relative overflow-hidden ${borderStyle}`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <span className={`text-base md:text-lg font-display font-bold tracking-wide ${isOrigin ? 'text-[#2563EB]' : isDestination ? 'text-[#10B981]' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {gate.name}
                                </span>
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor} ${dotPulse} mt-1.5`}></span>
                            </div>

                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl md:text-5xl font-mono font-bold text-slate-800 dark:text-white leading-none">
                                    {gate.level}
                                </span>
                                <span className="text-sm font-sans text-slate-500 dark:text-slate-400">cm</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}