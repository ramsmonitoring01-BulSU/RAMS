import React from 'react';
import { Map, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapWidget({ gateData, activeGate, setActiveGate }) {
    const mapCenter = [14.857917, 120.813817];
    const gates = Object.values(gateData);

    // 1. WIDENED BOUNDS: Expanded the box to cover a much larger area around the campus
    const southWest = [14.8450, 120.8000];
    const northEast = [14.8680, 120.8280];
    const campusBounds = [southWest, northEast];

    const impassableCount = gates.filter(g => g.status === 'Impassable').length;
    const warningCount = gates.filter(g => g.status === 'Warning').length;
    const safeCount = gates.length - impassableCount - warningCount;

    return (
        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-full transition-colors duration-300">

            {/* Map Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-card-dark shrink-0 transition-colors z-10">
                <h2 className="text-base font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                    <Map size={18} className="text-[#2563EB] dark:text-brand-light" /> Live BulSU Map
                </h2>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] dark:text-emerald-400 text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                </span>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative w-full h-full z-0">

                {/* Floating Legend */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-lg pointer-events-auto min-w-[140px] transition-colors duration-300">
                    <h3 className="text-[10px] font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        Gate Status
                    </h3>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-[#10B981]" /> Passable
                            </span>
                            <span className="font-mono font-bold">{safeCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                                <Shield size={14} className="text-[#F59E0B]" /> Warning
                            </span>
                            <span className="font-mono font-bold">{warningCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                                <ShieldAlert size={14} className="text-[#F43F5E] animate-pulse" /> Closed
                            </span>
                            <span className="font-mono font-bold text-[#F43F5E]">{impassableCount}</span>
                        </div>
                    </div>
                </div>

                <MapContainer
                    center={mapCenter}
                    zoom={16}
                    minZoom={15}
                    maxZoom={19}
                    maxBounds={campusBounds}
                    maxBoundsViscosity={0.8}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {gates.map((gate) => {
                        const isActive = activeGate === gate.id;

                        let statusColorBg = 'bg-[#10B981]';
                        let isAlert = false;

                        if (gate.status === 'Warning') {
                            statusColorBg = 'bg-[#F59E0B]';
                            isAlert = true;
                        } else if (gate.status === 'Impassable') {
                            statusColorBg = 'bg-[#F43F5E]';
                            isAlert = true;
                        }

                        if (isActive && !isAlert) {
                            statusColorBg = 'bg-[#2563EB]';
                        }

                        const shouldPulse = isAlert || isActive;
                        const activeBorder = isActive
                            ? 'border-[#2563EB] shadow-md scale-105'
                            : 'border-white dark:border-slate-600 scale-100';

                        // 1. THE MATH: Calculate the size multiplier based on water level
                        // We divide by 100 to get a percentage, and cap the max growth at 60cm using Math.min
                        // At 0cm scale is 1.0 (100%). At 30cm scale is 1.30 (130%). At 60cm scale is 1.60 (160%).
                        const pinScale = 1 + (Math.min(gate.level, 60) / 100);

                        const combinedHtml = `
                            <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
                                
                                <!-- 2. THE SCALED PIN: We wrap the dot in a div and apply the dynamic scale here -->
                                <div class="absolute inset-0 flex items-center justify-center transition-transform duration-500" style="transform: scale(${pinScale});">
                                    ${shouldPulse ? `<span class="absolute inline-flex h-full w-full rounded-full ${statusColorBg} opacity-50 animate-ping z-0"></span>` : ''}
                                    <span class="relative inline-flex rounded-full h-4 w-4 ${statusColorBg} border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 z-10"></span>
                                </div>
                                
                                <!-- THE CAPSULE: Stays at normal size so text is always perfectly readable -->
                                <div class="absolute left-8 ml-1 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-full overflow-hidden border-2 ${activeBorder} w-max pointer-events-auto transition-transform duration-300 group-hover:scale-105 z-20">
                                    <div class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 text-[11px] font-bold font-sans tracking-wide">
                                        ${gate.name}
                                    </div>
                                    <div class="${statusColorBg} text-white px-2.5 py-1 text-[11px] font-mono font-bold tracking-tight">
                                        ${gate.level}cm
                                    </div>
                                </div>
                                
                            </div>
                        `;

                        const customIcon = L.divIcon({
                            className: 'bg-transparent border-none outline-none',
                            html: combinedHtml,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                        });

                        return (
                            <Marker
                                key={gate.id}
                                position={[gate.lat, gate.lng]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => setActiveGate(gate.id),
                                }}
                            />
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}