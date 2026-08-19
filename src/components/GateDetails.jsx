import React from 'react';
import { MapPin, AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import VehicleClearance from './VehicleClearance';

export default function GateDetails({ currentGate, selectedVehicle, setSelectedVehicle, onBack }) {
    if (!currentGate) return null;

    let statusTheme = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    let StatusIcon = CheckCircle2;

    if (currentGate.status === 'Warning') {
        statusTheme = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
        StatusIcon = AlertTriangle;
    } else if (currentGate.status === 'Impassable') {
        statusTheme = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
        StatusIcon = XCircle;
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-4 md:p-5 w-full flex flex-col h-[340px] min-h-[340px] max-h-[340px] overflow-hidden gap-4 transition-colors duration-300">

            <div className="flex justify-between items-start shrink-0">
                <div className="flex items-center gap-2.5">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-1.5 md:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                            title="Back to Gates"
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} />
                        </button>
                    )}
                    <div>
                        <h3 className="text-base md:text-lg font-display font-bold text-slate-900 dark:text-white leading-tight">
                            {currentGate.name}
                        </h3>
                        <p className="text-xs md:text-sm font-sans text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} md:size={14} /> {currentGate.location}
                        </p>
                    </div>
                </div>

                <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md border flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-wide shrink-0 ${statusTheme}`}>
                    <StatusIcon size={14} />
                    {currentGate.status}
                </div>
            </div>

            <div className="shrink-0">
                <VehicleClearance
                    currentLevel={currentGate.level}
                    selectedVehicle={selectedVehicle}
                    setSelectedVehicle={setSelectedVehicle}
                />
            </div>

        </div>
    );
}