import React from 'react';
import { MapPin, AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import VehicleClearance from './VehicleClearance';

const DEFAULT_THRESHOLDS = {
    noWater: 2.0,       // <= 2 cm: No Water
    passableAll: 25.0,  // 2.1 - 25 cm: Passable to all vehicles
    notLight: 41.0      // 25.1 - 41 cm: Not passable to light vehicles
    // > 41.1 cm: Impassable to all vehicles
};

const getGateStatusDetails = (level, status, thresholds = DEFAULT_THRESHOLDS) => {
    const activeThresholds = thresholds || DEFAULT_THRESHOLDS;
    const depth = Number(level);

    if (!isNaN(depth) && level !== null && level !== undefined) {
        if (depth <= activeThresholds.noWater) {
            return {
                label: 'No Water',
                statusTheme: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                StatusIcon: CheckCircle2
            };
        }
        if (depth <= activeThresholds.passableAll) {
            return {
                label: 'Passable (All Vehicles)',
                statusTheme: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
                StatusIcon: CheckCircle2
            };
        }
        if (depth <= activeThresholds.notLight) {
            return {
                label: 'Not Passable (Light)',
                statusTheme: 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
                StatusIcon: AlertTriangle
            };
        }
        return {
            label: 'Impassable',
            statusTheme: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
            StatusIcon: XCircle
        };
    }

    // Fallback status string check
    switch (status) {
        case 'No Water':
            return {
                label: 'No Water',
                statusTheme: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                StatusIcon: CheckCircle2
            };
        case 'Passable to all vehicles':
        case 'Passable to All':
            return {
                label: 'Passable (All Vehicles)',
                statusTheme: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
                StatusIcon: CheckCircle2
            };
        case 'Not passable to light vehicles':
        case 'Warning':
            return {
                label: 'Not Passable (Light)',
                statusTheme: 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
                StatusIcon: AlertTriangle
            };
        case 'Impassable to all vehicles':
        case 'Impassable':
        default:
            return {
                label: 'Impassable',
                statusTheme: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
                StatusIcon: XCircle
            };
    }
};

export default function GateDetails({
    currentGate,
    selectedVehicle,
    setSelectedVehicle,
    onBack,
    customThresholds
}) {
    if (!currentGate) return null;

    const { label, statusTheme, StatusIcon } = getGateStatusDetails(
        currentGate.level,
        currentGate.status,
        customThresholds
    );

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
                            <MapPin size={14} /> {currentGate.location}
                        </p>
                    </div>
                </div>

                <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md border flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-wide shrink-0 ${statusTheme}`}>
                    <StatusIcon size={14} />
                    {label}
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
