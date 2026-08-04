import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function GateControlPanel({ gateData, originGate, destinationGate, handleGateClick }) {
    const gateNumbers = [1, 2, 3, 4];

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
            <h3 className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                Select Route (Tap 2 Nodes)
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {gateNumbers.map(num => {
                    const gate = gateData[num];

                    const isOrigin = originGate === num;
                    const isDestination = destinationGate === num;

                    let dotColor = 'bg-[#10B981]'; // Default: Green
                    if (gate.status === 'Warning') dotColor = 'bg-[#F59E0B]'; // Amber
                    if (gate.status === 'Impassable') dotColor = 'bg-[#F43F5E]'; // Red

                    // Dynamic Styling
                    let borderStyle = 'border-slate-100 dark:border-slate-700 bg-white dark:bg-card-dark hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                    if (isOrigin) borderStyle = 'bg-blue-50 dark:bg-blue-900/20 border-[#2563EB] shadow-sm';
                    if (isDestination) borderStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-[#10B981] shadow-sm';

                    return (
                        <button
                            key={num}
                            onClick={() => handleGateClick(num)}
                            className={`flex flex-col p-3 md:p-4 rounded-xl transition-all text-left border-2 relative overflow-hidden ${borderStyle}`}
                        >
                            <div className="flex justify-between items-center w-full mb-2 z-10">
                                <span className={`text-sm font-display font-bold tracking-wide ${isOrigin ? 'text-[#2563EB]' : isDestination ? 'text-[#10B981]' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {gate.name}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                            </div>

                            <span className="text-lg md:text-xl font-mono font-bold text-slate-800 dark:text-white z-10">
                                {gate.level}<span className="text-[10px] md:text-xs font-sans text-slate-500 dark:text-slate-400 ml-0.5">cm</span>
                            </span>

                            {/* Status Badges */}
                            {isOrigin && (
                                <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-bold text-[#2563EB] bg-blue-100 dark:bg-blue-800/40 px-1.5 py-0.5 rounded">
                                    <MapPin size={10} /> FROM
                                </span>
                            )}
                            {isDestination && (
                                <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-bold text-[#10B981] bg-emerald-100 dark:bg-emerald-800/40 px-1.5 py-0.5 rounded">
                                    <Navigation size={10} /> TO
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}