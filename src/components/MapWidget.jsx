// components/MapWidget.jsx
import React from 'react';
import { Map, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { campusGeoJSON } from '../utils/geoData';

export default function MapWidget({ gateData, selectedGate, handleGateClick, bestExit, selectedBuilding, selectedVehicle }) {

    if (!gateData || !campusGeoJSON) {
        return (
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[500px] h-full">
                <p className="text-slate-500 animate-pulse font-bold">Loading Map Data...</p>
            </div>
        );
    }

    const mapCenter = [14.857917, 120.813817];
    const southWest = [14.8450, 120.8000];
    const northEast = [14.8680, 120.8280];

    const gates = Object.values(gateData);
    const impassableCount = gates.filter(g => g?.status === 'Impassable').length;
    const warningCount = gates.filter(g => g?.status === 'Warning').length;
    const safeCount = gates.length - impassableCount - warningCount;

    const mapBuildings = campusGeoJSON.features.filter(f => f.geometry.type === 'Point');
    const allRoutes = campusGeoJSON.features.filter(f => f.geometry.type === 'LineString');

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-full">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-card-dark shrink-0 z-10">
                <h2 className="text-base font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                    <Map size={18} className="text-[#2563EB]" /> Live Navigation Map
                </h2>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] dark:text-emerald-400 text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                </span>
            </div>

            <div className="flex-1 relative w-full h-full z-0">

                {/* Stats Panel */}
                <div className="hidden md:block absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-lg">
                    <h3 className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-wider mb-3">Gate Status</h3>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="flex gap-2"><ShieldCheck size={14} className="text-[#10B981]" /> Passable</span>
                            <span className="font-mono font-bold pr-2">{safeCount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="flex gap-2"><Shield size={14} className="text-[#F59E0B]" /> Warning</span>
                            <span className="font-mono font-bold pr-2">{warningCount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="flex gap-2"><ShieldAlert size={14} className="text-[#F43F5E] animate-pulse" /> Closed</span>
                            <span className="font-mono font-bold text-[#F43F5E] pr-2">{impassableCount}</span>
                        </div>
                    </div>
                </div>

                <MapContainer center={mapCenter} zoom={16} minZoom={15} maxBounds={[southWest, northEast]} maxBoundsViscosity={0.8} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" maxNativeZoom={19} />

                    {/* DRAW BUILDINGS */}
                    {mapBuildings.map(bldg => {
                        const isSelected = selectedBuilding === bldg.properties.id;
                        const [lng, lat] = bldg.geometry.coordinates;

                        const bldgHtml = `
                            <div class="relative flex items-center justify-center pointer-events-none">
                                <div class="w-3 h-3 rounded-full ${isSelected ? 'bg-[#3B82F6] scale-150 shadow-lg shadow-blue-500/50 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'} border-2 border-white dark:border-slate-800 transition-all duration-300"></div>
                                ${isSelected ? `<div class="absolute top-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">${bldg.properties.name}</div>` : ''}
                            </div>
                        `;

                        return (
                            <Marker
                                key={bldg.properties.id}
                                position={[lat, lng]}
                                icon={L.divIcon({ className: 'bg-transparent', html: bldgHtml, iconSize: [12, 12] })}
                            />
                        );
                    })}

                    {/* DRAW CALCULATED ROUTE */}
                    {bestExit && bestExit.routeSegments && allRoutes.map(route => {
                        if (!bestExit.routeSegments.includes(route.properties.id)) return null;

                        const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        const lineColor = bestExit.isSafe ? "#10B981" : "#F97316";

                        return (
                            <Polyline
                                key={route.properties.id}
                                positions={leafletCoords}
                                color={lineColor}
                                weight={7}
                                opacity={0.8}
                                className="animate-pulse drop-shadow-md"
                            />
                        );
                    })}

                    {/* DRAW GATES */}
                    {gates.map(gate => {
                        if (!gate) return null;

                        const isSelected = selectedGate === gate.id;
                        const isBestExit = bestExit && bestExit.id === gate.id;
                        let statusColorBg = 'bg-[#10B981]';

                        if (gate.status === 'Warning') statusColorBg = 'bg-[#F59E0B]';
                        else if (gate.status === 'Impassable') statusColorBg = 'bg-[#F43F5E]';

                        if (isBestExit) statusColorBg = bestExit.isSafe ? 'bg-[#10B981]' : 'bg-[#F97316]';

                        const shouldPulse = isBestExit || gate.status !== 'Passable';
                        const pinScale = 1 + (Math.min(gate.level || 0, 60) / 100);

                        const combinedHtml = `
                            <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer group z-50">
                                <div class="absolute inset-0 flex items-center justify-center transition-transform" style="transform: scale(${pinScale});">
                                    ${shouldPulse ? `<span class="absolute inline-flex h-full w-full rounded-full ${statusColorBg} opacity-50 animate-ping z-0"></span>` : ''}
                                    <span class="relative inline-flex rounded-full h-4 w-4 ${statusColorBg} border-2 border-white shadow-md z-10"></span>
                                </div>
                                <div class="absolute left-8 ml-1 flex items-center shadow-lg rounded-full overflow-hidden border-2 ${isBestExit || isSelected ? `border-[${statusColorBg}] scale-110` : 'border-white'} w-max transition-transform">
                                    <div class="${isBestExit || isSelected ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'} px-2 py-1 text-[11px] font-bold tracking-wide flex items-center gap-1">
                                        ${isBestExit ? '★ BEST EXIT:' : ''} ${gate.name}
                                    </div>
                                    <div class="${statusColorBg} text-white px-2 py-1 text-[11px] font-mono font-bold">
                                        ${gate.level}cm
                                    </div>
                                </div>
                            </div>
                        `;

                        return (
                            <Marker
                                key={gate.id}
                                position={[gate.lat, gate.lng]}
                                icon={L.divIcon({ className: 'bg-transparent border-none outline-none', html: combinedHtml, iconSize: [32, 32], iconAnchor: [16, 16] })}
                                eventHandlers={{ click: () => handleGateClick(gate.id) }}
                            />
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}