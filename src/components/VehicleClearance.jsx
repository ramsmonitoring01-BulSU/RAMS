import React from 'react';
import { User, Car, Bike, Zap } from 'lucide-react';

export default function VehicleClearance({ currentLevel }) {
    const vehicles = [
        { id: 'human', label: 'Human', icon: User, threshold: 30, maxVisualHeight: 45 },
        { id: 'ebike', label: 'E-Bike', icon: Zap, threshold: 10, maxVisualHeight: 25 },
        { id: 'motorbike', label: 'Motorbike', icon: Bike, threshold: 20, maxVisualHeight: 40 },
        { id: 'sedan', label: 'Sedan', icon: Car, threshold: 15, maxVisualHeight: 30 },
    ];

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-sm w-full">

            <style>{`
                @keyframes wave-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes wave-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
            `}</style>

            <h3 className="text-[10px] sm:text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 text-center">
                Live Vehicle Clearance
            </h3>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
                {vehicles.map((v) => {
                    const isImpassable = currentLevel >= v.threshold;
                    const isWarning = currentLevel >= (v.threshold - 5) && !isImpassable;

                    const fillPercent = Math.min((currentLevel / v.maxVisualHeight) * 100, 100);
                    const thresholdPercent = (v.threshold / v.maxVisualHeight) * 100;

                    // 1. We now define a master theme using 'text-[color]' and 'opacity'. 
                    // The base div uses 'bg-current' and the SVG uses 'fill-current' so they merge perfectly.
                    let waterTheme = 'text-[#3B82F6] opacity-40';
                    let iconColor = 'text-slate-600 dark:text-slate-300';

                    if (isImpassable) {
                        waterTheme = 'text-[#F43F5E] opacity-60 animate-pulse';
                        iconColor = 'text-[#E11D48] dark:text-[#FDA4AF]';
                    } else if (isWarning) {
                        waterTheme = 'text-[#F59E0B] opacity-50';
                        iconColor = 'text-[#B45309] dark:text-[#FDE68A]';
                    }

                    return (
                        <div key={v.id} className="flex flex-col items-center w-full">

                            <div className="relative w-full h-20 sm:h-24 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">

                                {/* Danger Line */}
                                <div
                                    className="absolute w-full border-b-2 border-dashed border-[#F43F5E]/60 z-20"
                                    style={{ bottom: `${thresholdPercent}%` }}
                                ></div>

                                {/* Rising Water Base (Now uses bg-current to match the text color) */}
                                <div
                                    className={`absolute bottom-0 left-0 right-0 w-full transition-all duration-1000 ease-in-out z-10 bg-current ${waterTheme}`}
                                    style={{ height: `${fillPercent}%` }}
                                >
                                    {/* 2. The Solid SVG Wave Layer */}
                                    {fillPercent > 0 && (
                                        // bottom-[calc(100%-1px)] overlaps the base by exactly 1 pixel to prevent rendering seams
                                        <div className="absolute bottom-[calc(100%-1px)] left-0 w-[200%] h-[12px] pointer-events-none">

                                            {/* Back Wave: Solid shape, but 40% opacity */}
                                            <div
                                                className="absolute inset-0 opacity-40"
                                                style={{ animation: 'wave-right 5s linear infinite' }}
                                            >
                                                <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="w-full h-full fill-current">
                                                    {/* The path now traces the wave, then draws a box down to the bottom (L100,12 L0,12 Z) to create a solid fill */}
                                                    <path d="M0,5 Q12.5,0 25,5 T50,5 T75,5 T100,5 L100,12 L0,12 Z" />
                                                </svg>
                                            </div>

                                            {/* Front Wave: Solid shape, 100% opacity (which merges with the parent's opacity) */}
                                            <div
                                                className="absolute inset-0"
                                                style={{ animation: 'wave-left 3s linear infinite' }}
                                            >
                                                <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="w-full h-full fill-current">
                                                    <path d="M0,5 Q12.5,0 25,5 T50,5 T75,5 T100,5 L100,12 L0,12 Z" />
                                                </svg>
                                            </div>

                                        </div>
                                    )}
                                </div>

                                {/* Vehicle Icon */}
                                <div className="relative z-30 bg-white/50 dark:bg-slate-800/50 p-1.5 sm:p-2 rounded-md backdrop-blur-[2px]">
                                    <v.icon size={22} className={`transition-colors duration-300 ${iconColor} scale-90 sm:scale-100`} />
                                </div>

                            </div>

                            {/* Labels */}
                            <div className="text-center mt-1.5">
                                <div className={`text-[10px] sm:text-xs font-bold tracking-tight ${isImpassable ? 'text-[#E11D48] dark:text-[#FDA4AF]' : 'text-slate-700 dark:text-white'}`}>
                                    {v.label}
                                </div>
                                <div className="text-[8px] sm:text-[9px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                    Max {v.threshold}cm
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}