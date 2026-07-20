import React from 'react';
import { MapPin, Battery, Activity, AlertTriangle, CheckCircle2, XCircle, Droplets, Car, Bike, PersonStanding } from 'lucide-react';

// Using the same thresholds we defined in the Notification Context
const THRESHOLDS = {
    HUMAN: 15,
    E_TRIKE: 20,
    TRIKE: 25,
    MOTORBIKE: 35,
    SEDAN: 45,
};

export default function GateDetails({ currentGate }) {
    if (!currentGate) return null;

    let statusTheme = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    let StatusIcon = CheckCircle2;
    let progressBarColor = 'bg-emerald-500 dark:bg-emerald-400';

    if (currentGate.status === 'Warning') {
        statusTheme = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
        StatusIcon = AlertTriangle;
        progressBarColor = 'bg-amber-500 dark:bg-amber-400';
    } else if (currentGate.status === 'Impassable') {
        statusTheme = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
        StatusIcon = XCircle;
        progressBarColor = 'bg-rose-500 dark:bg-rose-400';
    }

    const MAX_SENSOR_HEIGHT = 50;
    const fillPercentage = Math.min((currentGate.level / MAX_SENSOR_HEIGHT) * 100, 100);

    // Helper function to determine if a vehicle is safe to pass
    const isSafe = (limit) => currentGate.level < limit;

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-5 transition-colors duration-300">

            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                        {currentGate.name}
                    </h3>
                    <p className="text-sm font-sans text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                        <MapPin size={14} /> {currentGate.location}
                    </p>
                </div>

                <div className={`px-3 py-1.5 rounded-md border flex items-center gap-2 font-sans text-sm font-bold tracking-wide ${statusTheme}`}>
                    <StatusIcon size={16} />
                    {currentGate.status}
                </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Droplets size={14} className="text-[#2563EB]" /> Live Depth
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {currentGate.level} <span className="text-sm font-sans text-slate-500">cm</span>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Battery size={14} className="text-slate-500" /> Power
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">{currentGate.battery}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity size={14} className="text-slate-500" /> Ping
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">{currentGate.ping}</span>
                    </div>
                </div>
            </div>

            {/* VISUALIZER & VEHICLE CLEARANCE */}
            <div>
                <div className="flex justify-between text-xs font-sans font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    <span>Safe to Pass</span>
                </div>

                {/* Vehicle Icons */}
                <div className="flex justify-between items-center mb-3 px-1">
                    <div className={`flex flex-col items-center gap-1 ${isSafe(THRESHOLDS.HUMAN) ? 'text-[#10B981]' : 'text-slate-300 dark:text-slate-600'}`}>
                        <PersonStanding size={20} />
                        <span className="text-[9px] font-bold">Foot</span>
                    </div>
                    <div className={`flex flex-col items-center gap-1 ${isSafe(THRESHOLDS.E_TRIKE) ? 'text-[#10B981]' : 'text-slate-300 dark:text-slate-600'}`}>
                        <Bike size={20} />
                        <span className="text-[9px] font-bold">E-Trike</span>
                    </div>
                    <div className={`flex flex-col items-center gap-1 ${isSafe(THRESHOLDS.MOTORBIKE) ? 'text-[#10B981]' : 'text-slate-300 dark:text-slate-600'}`}>
                        <Bike size={20} className="scale-x-[-1]" />
                        <span className="text-[9px] font-bold">Motor</span>
                    </div>
                    <div className={`flex flex-col items-center gap-1 ${isSafe(THRESHOLDS.SEDAN) ? 'text-[#10B981]' : 'text-slate-300 dark:text-slate-600'}`}>
                        <Car size={20} />
                        <span className="text-[9px] font-bold">Sedan</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                    <div
                        className={`h-full transition-all duration-700 ease-in-out ${progressBarColor}`}
                        style={{ width: `${fillPercentage}%` }}
                    />
                    {/* Threshold Markers */}
                    <div className="absolute top-0 bottom-0 border-l-2 border-slate-400/50" style={{ left: `${(THRESHOLDS.HUMAN / MAX_SENSOR_HEIGHT) * 100}%` }}></div>
                    <div className="absolute top-0 bottom-0 border-l-2 border-slate-400/50" style={{ left: `${(THRESHOLDS.E_TRIKE / MAX_SENSOR_HEIGHT) * 100}%` }}></div>
                    <div className="absolute top-0 bottom-0 border-l-2 border-slate-400/50" style={{ left: `${(THRESHOLDS.MOTORBIKE / MAX_SENSOR_HEIGHT) * 100}%` }}></div>
                    <div className="absolute top-0 bottom-0 border-l-2 border-slate-400/50" style={{ left: `${(THRESHOLDS.SEDAN / MAX_SENSOR_HEIGHT) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>0cm</span>
                    <span>{MAX_SENSOR_HEIGHT}cm</span>
                </div>
            </div>

        </div>
    );
}