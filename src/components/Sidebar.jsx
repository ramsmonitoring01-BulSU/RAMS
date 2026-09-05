// ============================================================================
// COMPONENT: Sidebar
// PURPOSE: The main navigation menu on the left side of the screen.
// Handles responsive collapsing and LTO classification tiers, including
// Micro-Mobility, Light Vehicles, and Heavy Vehicles.
// ============================================================================

import React, { useState } from 'react';
import {
    LayoutDashboard, DoorOpen, Download,
    ChevronLeft, ChevronRight, RefreshCw,
    Car, Truck, Bus, Container, CarFront, Bike,
    ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { supabase } from '../supabaseClient';

// LTO Standard Vehicle Classifications with designated icons
const VEHICLE_CATEGORIES = {
    micro: [
        {
            code: 'L1/L2',
            category: 'Electric Micro-Mobility',
            icon: Bike,
            models: ['Electric bicycles (e-bikes)', 'Electric scooters']
        },
        {
            code: 'A',
            category: 'Motorcycles & Mopeds',
            icon: Bike,
            models: ['Standard motorcycles', 'Mopeds']
        },
        {
            code: 'A1/NM',
            category: 'Bicycles & Tricycles',
            icon: Bike,
            models: ['Non-electric bicycles', 'Tricycles']
        }
    ],
    light: [
        {
            code: 'B',
            category: 'Light passenger vehicles',
            icon: Car,
            models: ['Toyota Vios', 'Honda City', 'Mitsubishi Mirage', 'Toyota Fortuner', 'Honda CR-V']
        },
        {
            code: 'B1',
            category: 'Light passenger vans',
            icon: CarFront,
            models: ['Toyota HiAce', 'Nissan Urvan', 'Hyundai H-100']
        },
        {
            code: 'B2',
            category: 'Light commercial vehicles',
            icon: Truck,
            models: ['Toyota Hilux', 'Ford Ranger', 'Mitsubishi L300', 'Isuzu Traviz']
        }
    ],
    heavy: [
        {
            code: 'C',
            category: 'Heavy commercial vehicles',
            icon: Truck,
            models: ['Isuzu Giga', 'Hino Ranger', 'Fuso Fighter']
        },
        {
            code: 'D',
            category: 'Passenger buses',
            icon: Bus,
            models: ['Isuzu Traviz Bus', 'Hino RK8J', 'Yutong Bus', 'Hyundai Universe']
        },
        {
            code: 'CE',
            category: 'Heavy articulated vehicles',
            icon: Container,
            models: ['Volvo FH', 'Scania R-Series', 'Isuzu Tractor Head with Trailer']
        }
    ]
};

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    activeView,
    setActiveView,
    selectedVehicle,
    setSelectedVehicle
}) {
    const [isExporting, setIsExporting] = useState(false);
    const [isVehiclesMenuOpen, setIsVehiclesMenuOpen] = useState(true);
    const [activeVehicleTab, setActiveVehicleTab] = useState('light'); // 'micro' | 'light' | 'heavy'

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const { data, error } = await supabase
                .from('gate_telemetry')
                .select('created_at, gate_id, water_level_cm, battery_voltage, status')
                .order('created_at', { ascending: false })
                .limit(1000);

            if (error) throw error;

            if (!data || data.length === 0) {
                alert("No data available to export.");
                setIsExporting(false);
                return;
            }

            const headers = ['Timestamp', 'Gate ID', 'Water Level (cm)', 'Battery (V)', 'Status'];
            const csvRows = data.map(row => {
                const date = new Date(row.created_at).toLocaleString().replace(/,/g, '');
                return `${date},${row.gate_id},${row.water_level_cm},${row.battery_voltage},${row.status}`;
            });

            const csvContent = [headers.join(','), ...csvRows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `SmarTech_Telemetry_Export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export data. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleSelectVehicleModel = (model) => {
        if (setSelectedVehicle) {
            setSelectedVehicle(model);
        }
        if (setIsSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* MAIN SIDEBAR CONTAINER */}
            <nav className={`fixed md:relative top-0 left-0 h-screen bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64 w-64'}
            `}>

                {/* BRANDING & LOGO SECTION */}
                <div className={`flex items-center h-20 px-4 md:px-6 mb-2 border-b border-slate-100 dark:border-slate-700 transition-colors shrink-0 ${isDesktopCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
                    <div className="bg-white p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 flex items-center justify-center w-10 h-10 min-w-[40px]">
                        <img
                            src="/RAMS-LOGO.png"
                            alt="RAMS Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className={`overflow-hidden transition-all whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
                        <h1 className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-white" title="Resiliency Energy and Continuity">
                            SmarTech
                        </h1>
                        <p className="text-[10px] font-sans font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            IOT System
                        </p>
                    </div>
                </div>

                {/* NAVIGATION & VEHICLE LIST */}
                <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
                    <button
                        onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-sans ${activeView === 'dashboard'
                            ? 'bg-blue-50 dark:bg-brand-dark/20 text-[#2563EB] dark:text-brand-light font-semibold'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'
                            } ${isDesktopCollapsed ? 'justify-center' : ''}`}
                    >
                        <LayoutDashboard size={19} className="min-w-[19px]" />
                        <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                    </button>

                    <button
                        onClick={() => { setActiveView('nodes'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-sans ${activeView === 'nodes'
                            ? 'bg-blue-50 dark:bg-brand-dark/20 text-[#2563EB] dark:text-brand-light font-semibold'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'
                            } ${isDesktopCollapsed ? 'justify-center' : ''}`}
                    >
                        <DoorOpen size={19} className="min-w-[19px]" />
                        <span className={`text-sm whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>Nodes</span>
                    </button>

                    {/* VEHICLES DROPDOWN ACCORDION */}
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <button
                            onClick={() => {
                                if (isDesktopCollapsed) setIsDesktopCollapsed(false);
                                setIsVehiclesMenuOpen(!isVehiclesMenuOpen);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all font-sans text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isDesktopCollapsed ? 'justify-center' : ''
                                }`}
                            title="LTO Vehicle Classifications"
                        >
                            <div className="flex items-center gap-3">
                                <Car size={19} className="min-w-[19px] text-blue-600 dark:text-blue-400" />
                                <span className={`text-sm font-semibold whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
                                    Vehicles
                                </span>
                            </div>
                            {!isDesktopCollapsed && (
                                isVehiclesMenuOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />
                            )}
                        </button>

                        {/* VEHICLE CONTENT */}
                        {isVehiclesMenuOpen && !isDesktopCollapsed && (
                            <div className="mt-1.5 pl-1 flex flex-col gap-2">
                                {/* 3-WAY TAB SELECTOR: MICRO / LIGHT / HEAVY */}
                                <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-[11px] font-semibold">
                                    <button
                                        onClick={() => setActiveVehicleTab('micro')}
                                        className={`py-1 rounded-md flex items-center justify-center gap-1 transition-all ${activeVehicleTab === 'micro'
                                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Bike size={12} /> Micro
                                    </button>
                                    <button
                                        onClick={() => setActiveVehicleTab('light')}
                                        className={`py-1 rounded-md flex items-center justify-center gap-1 transition-all ${activeVehicleTab === 'light'
                                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Car size={12} /> Light
                                    </button>
                                    <button
                                        onClick={() => setActiveVehicleTab('heavy')}
                                        className={`py-1 rounded-md flex items-center justify-center gap-1 transition-all ${activeVehicleTab === 'heavy'
                                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Truck size={12} /> Heavy
                                    </button>
                                </div>

                                {/* GROUP CARDS WITH DISTINCT ICONS */}
                                <div className="flex flex-col gap-3 py-1">
                                    {VEHICLE_CATEGORIES[activeVehicleTab].map((group) => {
                                        const GroupIcon = group.icon;
                                        return (
                                            <div key={group.code} className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 px-1">
                                                    <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                                                        <GroupIcon size={12} />
                                                    </span>
                                                    <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[9px] font-bold">
                                                        {group.code}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate" title={group.category}>
                                                        {group.category}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-0.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700/60 ml-2.5 my-0.5">
                                                    {group.models.map((model) => {
                                                        const isSelected = selectedVehicle === model;
                                                        return (
                                                            <button
                                                                key={model}
                                                                onClick={() => handleSelectVehicleModel(model)}
                                                                className={`text-left text-[11px] py-1 px-2 rounded-md transition-all flex items-center justify-between group ${isSelected
                                                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-semibold'
                                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-1.5 truncate">
                                                                    <GroupIcon size={10} className={`shrink-0 opacity-40 group-hover:opacity-80 ${isSelected ? 'text-blue-600 dark:text-blue-400 opacity-100' : ''}`} />
                                                                    <span className="truncate">{model}</span>
                                                                </div>
                                                                {isSelected && <Check size={11} className="shrink-0 text-blue-600 dark:text-blue-400 ml-1" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BOTTOM ACTIONS (Export Button) */}
                <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/60 shrink-0">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`w-full bg-blue-50 dark:bg-brand-dark/20 text-[#2563EB] dark:text-brand-light font-sans font-semibold text-xs py-2.5 rounded-xl hover:bg-[#2563EB] dark:hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2 ${isDesktopCollapsed ? 'px-0' : 'px-3'} ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isExporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                        <span className={`whitespace-nowrap ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </span>
                    </button>
                </div>

                {/* Desktop Collapse Toggle */}
                <div className="border-t border-slate-100 dark:border-slate-700 p-2 shrink-0 transition-colors">
                    <button
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="hidden md:flex w-full items-center justify-center py-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                        {isDesktopCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </nav>
        </>
    );
}