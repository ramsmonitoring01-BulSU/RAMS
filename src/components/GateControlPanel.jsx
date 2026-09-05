import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const DEFAULT_THRESHOLDS = {
    noWater: 2.0,       // <= 2 cm: No Water
    passableAll: 20.0,  // 2.1 - 20 cm: Passable to all vehicles
    notLight: 45.0      // 20.1 - 45 cm: Not passable to light vehicles
    // > 45 cm: Impassable to all vehicles
};

const getGateDotStyle = (level, status, thresholds = DEFAULT_THRESHOLDS) => {
    const activeThresholds = thresholds || DEFAULT_THRESHOLDS;

    // Evaluate dynamically by depth in centimeters
    if (level !== undefined && level !== null) {
        const depth = Number(level) || 0;
        if (depth <= activeThresholds.noWater) {
            return { dotColor: 'bg-[#10B981]', dotPulse: '' };
        }
        if (depth <= activeThresholds.passableAll) {
            return { dotColor: 'bg-[#EAB308]', dotPulse: '' };
        }
        if (depth <= activeThresholds.notLight) {
            return { dotColor: 'bg-[#F97316]', dotPulse: 'animate-pulse' };
        }
        return { dotColor: 'bg-[#F43F5E]', dotPulse: 'animate-pulse' };
    }

    // Fallback status string check
    switch (status) {
        case 'No Water':
            return { dotColor: 'bg-[#10B981]', dotPulse: '' };
        case 'Passable to all vehicles':
        case 'Passable to All':
            return { dotColor: 'bg-[#EAB308]', dotPulse: '' };
        case 'Not passable to light vehicles':
        case 'Warning':
            return { dotColor: 'bg-[#F97316]', dotPulse: 'animate-pulse' };
        case 'Impassable to all vehicles':
        case 'Impassable':
        default:
            return { dotColor: 'bg-[#F43F5E]', dotPulse: 'animate-pulse' };
    }
};

export default function GateControlPanel({
    gateData,
    originGate,
    destinationGate,
    handleGateClick,
    customThresholds
}) {
    const gateNumbers = [1, 2, 3, 4];

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300 w-full h-[340px] min-h-[340px] max-h-[340px] overflow-hidden flex flex-col">

            <h3 className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider shrink-0">
                Select Gate
            </h3>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gateNumbers.map(num => {
                    const gate = gateData[num];
                    if (!gate) return null;

                    const isOrigin = originGate === num;
                    const isDestination = destinationGate === num;

                    const { dotColor, dotPulse } = getGateDotStyle(
                        gate.level,
                        gate.status,
                        customThresholds
                    );

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