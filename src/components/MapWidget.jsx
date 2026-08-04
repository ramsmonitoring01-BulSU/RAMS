import React from 'react';
import { Map, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { findBestRoute } from '../utils/routeCalculator';

export default function MapWidget({ gateData, originGate, destinationGate, handleGateClick, selectedVehicle }) {
    const mapCenter = [14.857917, 120.813817];
    const gates = Object.values(gateData);

    const southWest = [14.8450, 120.8000];
    const northEast = [14.8680, 120.8280];
    const campusBounds = [southWest, northEast];

    const impassableCount = gates.filter(g => g.status === 'Impassable').length;
    const warningCount = gates.filter(g => g.status === 'Warning').length;
    const safeCount = gates.length - impassableCount - warningCount;

    // Map exact limits from VehicleClearance
    const vehicleThresholds = {
        'human': 30,
        'ebike': 10,
        'motorbike': 20,
        'sedan': 15
    };

    // === COMPLETE ROAD NETWORK (MAIN & ALTERNATIVES) ===
    const campusRoutes = [
        // --- MAIN NODE-TO-NODE ROUTES ---
        {
            id: 'route-1-2',
            type: 'main',
            name: 'Gate 1 ↔ Gate 2',
            connectedGates: [1, 2],
            coordinates: [
                [14.857138, 120.8121541],
                [14.8582781, 120.8135139],
                [14.8578815, 120.813895],
                [14.8576625, 120.8140425],
                [14.8575559, 120.8141407],
                [14.8573009, 120.8143722]
            ]
        },
        {
            id: 'route-3-4',
            type: 'main',
            name: 'Gate 3 ↔ Gate 4',
            connectedGates: [3, 4],
            coordinates: [
                [14.8579207, 120.8159781],
                [14.858488, 120.815408],
                [14.8596563, 120.8143612],
                [14.859742, 120.8142936]
            ]
        },
        {
            id: 'route-2-3',
            type: 'main',
            name: 'Gate 2 ↔ Gate 3',
            connectedGates: [2, 3],
            coordinates: [
                [14.857307, 120.8143606],
                [14.8575586, 120.814138],
                [14.8578799, 120.8145017],
                [14.8578193, 120.814577],
                [14.85848, 120.8154205],
                [14.8579647, 120.815916],
                [14.857892, 120.8160006]
            ]
        },
        {
            id: 'route-2-4',
            type: 'main',
            name: 'Gate 2 ↔ Gate 4',
            connectedGates: [2, 4],
            coordinates: [
                [14.8573133, 120.8143556],
                [14.8575615, 120.8141319],
                [14.8578809, 120.8145081],
                [14.857817, 120.8145844],
                [14.8584903, 120.8154233],
                [14.8596557, 120.8143532],
                [14.8597515, 120.814282]
            ]
        },
        {
            id: 'route-1-3',
            type: 'main',
            name: 'Gate 1 ↔ Gate 3',
            connectedGates: [1, 3],
            coordinates: [
                [14.8571279, 120.8121523],
                [14.8582758, 120.813513],
                [14.8578787, 120.8138955],
                [14.8575544, 120.8141307],
                [14.8578848, 120.8145039],
                [14.8578242, 120.814576],
                [14.8584879, 120.8154226],
                [14.8579484, 120.8159338],
                [14.8578999, 120.8159965]
            ]
        },
        {
            id: 'route-1-4',
            type: 'main',
            name: 'Gate 1 ↔ Gate 4',
            connectedGates: [1, 4],
            coordinates: [
                [14.8571315, 120.8121406],
                [14.8582741, 120.8135109],
                [14.8578831, 120.8138966],
                [14.8575497, 120.8141255],
                [14.8578862, 120.8144986],
                [14.8578164, 120.8145864],
                [14.8584933, 120.815424],
                [14.8596516, 120.8143541],
                [14.8597517, 120.8142789]
            ]
        },

        // --- ALTERNATIVE / DETOUR ROUTES ---
        {
            id: 'alt-segment-1',
            type: 'alternative',
            name: 'Alternative Route 1',
            coordinates: [
                [14.8576351, 120.8127401],
                [14.8570624, 120.8133025],
                [14.8573254, 120.8135746],
                [14.8572763, 120.813623],
                [14.8576596, 120.8140425]
            ]
        },
        {
            id: 'alt-segment-2',
            type: 'alternative',
            name: 'Alternative Route 2',
            coordinates: [
                [14.8578891, 120.8130397],
                [14.8573231, 120.8135722]
            ]
        },
        {
            id: 'alt-segment-3',
            type: 'alternative',
            name: 'Alternative Route 3',
            coordinates: [
                [14.857893, 120.8144937],
                [14.85818, 120.8142351],
                [14.8578831, 120.8138921]
            ]
        }
    ];

    // === RUN THE PATHFINDING BRAIN ===
    const safeRouteIds = findBestRoute(
        originGate,
        destinationGate,
        selectedVehicle,
        vehicleThresholds,
        gateData,
        campusRoutes
    );

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-full transition-colors duration-300">

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
                <div className="hidden md:block absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-lg pointer-events-auto min-w-[140px] transition-colors duration-300">
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
                    maxZoom={22}
                    maxBounds={campusBounds}
                    maxBoundsViscosity={0.8}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        maxNativeZoom={19}
                        maxZoom={22}
                    />

                    {/* === DYNAMIC REROUTING WITH HAZARD COLORS === */}
                    {campusRoutes.map((route) => {
                        // 1. HIDDEN UNTIL ALL CONDITIONS ARE MET
                        if (!originGate || !destinationGate || !selectedVehicle) return null;

                        // 2. CHECK IF THIS ROUTE IS PART OF THE CALCULATED BEST PATH
                        const isPartOfBestRoute = safeRouteIds.includes(route.id);
                        if (!isPartOfBestRoute) return null;

                        // 3. DETERMINE HAZARD COLOR FOR THIS SPECIFIC SEGMENT
                        const currentClearance = vehicleThresholds[selectedVehicle];
                        const warningClearance = currentClearance - 5;

                        const gateAId = route.connectedGates ? route.connectedGates[0] : null;
                        const gateBId = route.connectedGates ? route.connectedGates[1] : null;

                        const gateA = gates.find(g => String(g.id) === String(gateAId)) || { level: 0 };
                        const gateB = gates.find(g => String(g.id) === String(gateBId)) || { level: 0 };

                        // Path validity depends on the worst flooded node on this specific line
                        const maxWaterLevelOnSegment = Math.max(gateA.level, gateB.level);

                        let routeColor = "#10B981"; // Default: Safe Green
                        if (maxWaterLevelOnSegment >= currentClearance) {
                            routeColor = "#F43F5E"; // Impassable Red
                        } else if (maxWaterLevelOnSegment >= warningClearance) {
                            routeColor = "#F59E0B"; // Warning Orange
                        }

                        return (
                            <Polyline
                                key={route.id}
                                positions={route.coordinates}
                                color={routeColor}
                                weight={7}
                                opacity={0.9}
                                className="transition-all duration-700 animate-pulse drop-shadow-md"
                            />
                        );
                    })}

                    {/* === GATE MARKERS === */}
                    {gates.map((gate) => {
                        const isOrigin = originGate === gate.id;
                        const isDestination = destinationGate === gate.id;

                        let statusColorBg = 'bg-[#10B981]';
                        let isAlert = false;

                        if (gate.status === 'Warning') {
                            statusColorBg = 'bg-[#F59E0B]';
                            isAlert = true;
                        } else if (gate.status === 'Impassable') {
                            statusColorBg = 'bg-[#F43F5E]';
                            isAlert = true;
                        }

                        // Override color if selected as start/end
                        if (isOrigin) {
                            statusColorBg = 'bg-[#2563EB]';
                        } else if (isDestination) {
                            statusColorBg = 'bg-[#10B981]';
                        }

                        const shouldPulse = isAlert || isOrigin || isDestination;
                        const activeBorder = (isOrigin || isDestination)
                            ? `border-[${statusColorBg}] shadow-md scale-105`
                            : 'border-white dark:border-slate-600 scale-100';

                        const pinScale = 1 + (Math.min(gate.level, 60) / 100);

                        // Add "FROM" and "TO" labels to the markers if they are selected
                        const markerLabel = isOrigin ? 'FROM: ' : isDestination ? 'TO: ' : '';

                        const combinedHtml = `
                            <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
                                <div class="absolute inset-0 flex items-center justify-center transition-transform duration-500" style="transform: scale(${pinScale});">
                                    ${shouldPulse ? `<span class="absolute inline-flex h-full w-full rounded-full ${statusColorBg} opacity-50 animate-ping z-0"></span>` : ''}
                                    <span class="relative inline-flex rounded-full h-4 w-4 ${statusColorBg} border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 z-10"></span>
                                </div>
                                <div class="absolute left-8 ml-1 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-full overflow-hidden border-2 ${activeBorder} w-max pointer-events-auto transition-transform duration-300 group-hover:scale-105 z-20">
                                    <div class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 text-[11px] font-bold font-sans tracking-wide">
                                        ${markerLabel}${gate.name}
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
                                    click: () => handleGateClick(gate.id),
                                }}
                            />
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}