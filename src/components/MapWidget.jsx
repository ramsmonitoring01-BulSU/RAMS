// Map widget plus the GPS button & Dynamic Research Thresholds
import React, { useState, useEffect, useMemo } from 'react';
import {
    Map,
    ShieldAlert,
    ShieldCheck,
    Shield,
    Crosshair,
    Loader2,
    SlidersHorizontal,
    RotateCcw,
    X,
    Waves
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { campusGeoJSON } from '../utils/geoData';

// ============================================================================
// DEFAULT FLOOD THRESHOLDS (modifiable via UI or props for research)
// ============================================================================
export const DEFAULT_THRESHOLDS = {
    noWater: 2.0,       // <= 2 cm: No Water (Dry road conditions)
    passableAll: 25.0,  // 2.1 - 25 cm: Gutter-deep (~8 in); Passable to all vehicles
    notLight: 41.0      // 25.1 - 41 cm: Knee-deep (~18 in); Impassable to light vehicles
    // > 41.1 cm: Impassable to all vehicles
};

// 4-Tier Color Mapping Theme
export const getStatusTheme = (statusKey) => {
    switch (statusKey) {
        case 'no_water':
            return {
                id: 'no_water',
                label: 'No Water',
                shortLabel: 'No Water',
                bg: 'bg-[#10B981]',
                hex: '#10B981',
                border: 'border-[#10B981]',
                text: 'text-[#10B981]',
                pulse: false
            };
        case 'passable_all':
            return {
                id: 'passable_all',
                label: 'Passable to all vehicles',
                shortLabel: 'Passable (All)',
                bg: 'bg-[#EAB308]',
                hex: '#EAB308',
                border: 'border-[#EAB308]',
                text: 'text-[#EAB308]',
                pulse: false
            };
        case 'not_light':
            return {
                id: 'not_light',
                label: 'Not passable to light vehicles',
                shortLabel: 'Not Passable (Light)',
                bg: 'bg-[#F97316]',
                hex: '#F97316',
                border: 'border-[#F97316]',
                text: 'text-[#F97316]',
                pulse: true
            };
        case 'impassable':
        default:
            return {
                id: 'impassable',
                label: 'Impassable to all vehicles',
                shortLabel: 'Impassable (All)',
                bg: 'bg-[#F43F5E]',
                hex: '#F43F5E',
                border: 'border-[#F43F5E]',
                text: 'text-[#F43F5E]',
                pulse: true
            };
    }
};

// Evaluates raw centimeter reading against active research thresholds
export const evaluateGateStatus = (level, thresholds = DEFAULT_THRESHOLDS) => {
    const depth = Number(level) || 0;
    if (depth <= thresholds.noWater) return 'no_water';
    if (depth <= thresholds.passableAll) return 'passable_all';
    if (depth <= thresholds.notLight) return 'not_light';
    return 'impassable';
};

// Helper component to handle map pan/zoom actions via Leaflet instance
function LocationController({ targetPosition }) {
    const map = useMap();
    useEffect(() => {
        if (targetPosition) {
            map.flyTo(targetPosition, 17, { animate: true });
        }
    }, [targetPosition, map]);
    return null;
}

export default function MapWidget({
    gateData,
    selectedGate,
    handleGateClick,
    bestExit,
    selectedBuilding,
    selectedVehicle,
    customThresholds,
    onThresholdChange
}) {
    const [userPosition, setUserPosition] = useState(null);
    const [userAccuracy, setUserAccuracy] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locateTrigger, setLocateTrigger] = useState(null);
    const [watchId, setWatchId] = useState(null);

    // Research thresholds state
    const [thresholds, setThresholds] = useState(customThresholds || DEFAULT_THRESHOLDS);
    const [showConfig, setShowConfig] = useState(false);

    useEffect(() => {
        if (customThresholds) {
            setThresholds(customThresholds);
        }
    }, [customThresholds]);

    const handleThresholdUpdate = (field, value) => {
        const updated = {
            ...thresholds,
            [field]: parseFloat(value) || 0
        };
        setThresholds(updated);
        if (onThresholdChange) onThresholdChange(updated);
    };

    const handleResetThresholds = () => {
        setThresholds(DEFAULT_THRESHOLDS);
        if (onThresholdChange) onThresholdChange(DEFAULT_THRESHOLDS);
    };

    // Geolocation teardown
    useEffect(() => {
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [watchId]);

    const toggleTracking = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
            setUserPosition(null);
        } else {
            setIsLocating(true);
            const id = navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords;
                    const newCoords = [latitude, longitude];
                    setUserPosition(newCoords);
                    setUserAccuracy(accuracy);
                    setLocateTrigger(newCoords);
                    setIsLocating(false);
                },
                (err) => {
                    console.error("Error getting location: ", err.message);
                    if (err.code === 1) alert("Please allow location permissions to use this feature.");
                    setIsLocating(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
            setWatchId(id);
        }
    };

    // Dynamically evaluate all gate nodes based on research thresholds
    const processedGates = useMemo(() => {
        if (!gateData) return [];
        return Object.values(gateData).map(gate => {
            if (!gate) return null;
            const statusKey = evaluateGateStatus(gate.level, thresholds);
            const theme = getStatusTheme(statusKey);
            return {
                ...gate,
                evaluatedStatus: statusKey,
                theme
            };
        }).filter(Boolean);
    }, [gateData, thresholds]);

    if (!gateData || !campusGeoJSON) {
        return (
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center w-full h-full min-h-[400px] lg:min-h-0">
                <p className="text-slate-500 animate-pulse font-bold">Loading Map Data...</p>
            </div>
        );
    }

    const mapCenter = [14.857917, 120.813817];
    const southWest = [14.8660, 120.8000];
    const northEast = [14.8680, 120.8280];

    // Status counts for legend
    const noWaterCount = processedGates.filter(g => g.evaluatedStatus === 'no_water').length;
    const passableAllCount = processedGates.filter(g => g.evaluatedStatus === 'passable_all').length;
    const notLightCount = processedGates.filter(g => g.evaluatedStatus === 'not_light').length;
    const impassableCount = processedGates.filter(g => g.evaluatedStatus === 'impassable').length;

    const mapBuildings = campusGeoJSON.features.filter(f => f.geometry.type === 'Point');
    const allRoutes = campusGeoJSON.features.filter(f => f.geometry.type === 'LineString');

    const userIcon = L.divIcon({
        className: 'bg-transparent',
        html: `
            <div class="relative flex items-center justify-center w-6 h-6 z-50">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 border-2 border-white shadow-md"></span>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col w-full h-full min-h-[400px] lg:min-h-0">

            {/* TOP BAR WITH RESEARCH CONTROLS */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-card-dark shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                        <Map size={18} className="text-[#2563EB]" /> Live Navigation Map
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    {/* Research Threshold Toggle */}
                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        title="Adjust Research Thresholds"
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${showConfig
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                    >
                        <SlidersHorizontal size={13} />
                        <span className="hidden sm:inline">Research Config</span>
                    </button>

                    <span className="bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] dark:text-emerald-400 text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                    </span>
                </div>
            </div>

            <div className="flex-1 relative w-full z-0 bg-slate-50 dark:bg-slate-900">

                {/* FLOATING RESEARCH THRESHOLD CONFIGURATION MODAL */}
                {showConfig && (
                    <div className="absolute top-4 left-4 z-[1001] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-xl w-72 transition-all">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                                <Waves size={14} className="text-indigo-500" /> Depth Thresholds (cm)
                            </div>
                            <button
                                onClick={() => setShowConfig(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2.5 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> No Water (&le;)
                                </span>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={thresholds.noWater}
                                    onChange={(e) => handleThresholdUpdate('noWater', e.target.value)}
                                    className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-[#EAB308]"></span> Passable All (&le;)
                                </span>
                                <input
                                    type="number"
                                    step="1"
                                    min={thresholds.noWater}
                                    value={thresholds.passableAll}
                                    onChange={(e) => handleThresholdUpdate('passableAll', e.target.value)}
                                    className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-[#F97316]"></span> Not Light (&le;)
                                </span>
                                <input
                                    type="number"
                                    step="1"
                                    min={thresholds.passableAll}
                                    value={thresholds.notLight}
                                    onChange={(e) => handleThresholdUpdate('notLight', e.target.value)}
                                    className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono font-bold text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 pt-1 text-[11px]">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span> Impassable All
                                </span>
                                <span className="font-mono">&gt; {thresholds.notLight} cm</span>
                            </div>

                            <button
                                onClick={handleResetThresholds}
                                className="mt-2 flex items-center justify-center gap-1.5 text-[11px] py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                <RotateCcw size={11} /> Reset Defaults
                            </button>
                        </div>
                    </div>
                )}

                {/* TOP-RIGHT GPS TARGET BUTTON */}
                <button
                    onClick={toggleTracking}
                    title={watchId ? "Stop Live Tracking" : "Start Live Tracking"}
                    className={`absolute top-4 right-4 z-[1000] p-2.5 rounded-xl shadow-lg border transition-all duration-200 flex items-center justify-center cursor-pointer group
                        ${watchId
                            ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 shadow-blue-500/20'
                            : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                >
                    {isLocating ? (
                        <Loader2 size={20} className="text-blue-500 animate-spin" />
                    ) : (
                        <Crosshair size={20} className={`${watchId ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-blue-500'} transition-colors`} />
                    )}
                </button>

                {/* 4-Tier Gate Status Legend (Desktop) */}
                <div className="hidden md:block absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-lg">
                    <h3 className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-wider mb-2.5">Gate Status</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> No Water
                            </span>
                            <span className="font-mono font-bold">{noWaterCount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></span> Passable (All)
                            </span>
                            <span className="font-mono font-bold">{passableAllCount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span> Not Passable (Light)
                            </span>
                            <span className="font-mono font-bold">{notLightCount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] animate-pulse"></span> Impassable (All)
                            </span>
                            <span className="font-mono font-bold text-[#F43F5E]">{impassableCount}</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Gate Carousel */}
                <div className="md:hidden absolute bottom-4 left-0 right-0 w-full z-[1000] px-3 pointer-events-none">
                    <div className="flex gap-2 overflow-x-auto snap-x pb-2 pointer-events-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {processedGates.map(gate => {
                            if (!gate) return null;
                            const dotColor = gate.theme.bg;
                            const pulse = gate.theme.pulse ? 'animate-pulse' : '';

                            const isSelected = selectedGate === gate.id;
                            const borderStyle = isSelected
                                ? 'border-[#2563EB] bg-blue-50/95 dark:bg-blue-900/40'
                                : 'border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90';

                            return (
                                <button
                                    key={gate.id}
                                    onClick={() => handleGateClick(gate.id)}
                                    className={`flex-none snap-center backdrop-blur-md border rounded-xl px-3 py-2 shadow-lg flex flex-col items-start min-w-[90px] transition-all duration-200 ${borderStyle}`}
                                >
                                    <div className="flex justify-between w-full items-center mb-1">
                                        <span className={`text-[10px] font-sans font-bold uppercase tracking-wide ${isSelected ? 'text-[#2563EB]' : 'text-slate-500'}`}>
                                            {gate.name}
                                        </span>
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} ${pulse}`}></span>
                                    </div>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-lg font-mono font-bold text-slate-800 dark:text-white leading-none">
                                            {gate.level}
                                        </span>
                                        <span className="text-[9px] font-sans text-slate-500">cm</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="absolute inset-0">
                    <MapContainer
                        center={mapCenter}
                        zoom={16}
                        minZoom={15}
                        maxBounds={[southWest, northEast]}
                        maxBoundsViscosity={0.8}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />

                        {/* Handles smooth panning to user GPS location */}
                        <LocationController targetPosition={locateTrigger} />

                        {/* User GPS Marker & Accuracy Radius */}
                        {userPosition && (
                            <>
                                <Marker position={userPosition} icon={userIcon} />
                                <Circle
                                    center={userPosition}
                                    radius={userAccuracy || 20}
                                    pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.12, weight: 1 }}
                                />
                            </>
                        )}

                        {mapBuildings.map(bldg => {
                            if (selectedBuilding !== bldg.properties.id) return null;
                            const [lng, lat] = bldg.geometry.coordinates;
                            const bldgHtml = `
                                <div class="relative flex flex-col items-center justify-center pointer-events-none z-50">
                                    <div class="w-4 h-4 rounded-full bg-[#3B82F6] shadow-lg shadow-blue-500/50 animate-pulse border-2 border-white dark:border-slate-800"></div>
                                    <div class="absolute top-5 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-lg whitespace-nowrap">${bldg.properties.name}</div>
                                </div>
                            `;
                            return (
                                <Marker
                                    key={bldg.properties.id}
                                    position={[lat, lng]}
                                    icon={L.divIcon({ className: 'bg-transparent', html: bldgHtml, iconSize: [16, 16] })}
                                />
                            );
                        })}

                        {bestExit && bestExit.routeSegments && allRoutes.map(route => {
                            if (!bestExit.routeSegments.includes(route.properties.id)) return null;
                            const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                            let lineColor = "#3B82F6";
                            if (bestExit.routeStatus === 'warning') lineColor = "#F97316";
                            if (bestExit.routeStatus === 'impassable') lineColor = "#F43F5E";

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

                        {processedGates.map(gate => {
                            if (!gate) return null;
                            const isSelected = selectedGate === gate.id;
                            const isBestExit = bestExit && bestExit.id === gate.id;
                            let statusColorBg = gate.theme.bg;

                            if (isBestExit) {
                                if (bestExit.routeStatus === 'safe') statusColorBg = 'bg-[#3B82F6]';
                                else if (bestExit.routeStatus === 'warning') statusColorBg = 'bg-[#F97316]';
                                else if (bestExit.routeStatus === 'impassable') statusColorBg = 'bg-[#F43F5E]';
                            }

                            const shouldPulse = isBestExit || gate.theme.pulse;
                            const pinScale = 1 + (Math.min(gate.level || 0, 60) / 100);
                            const displayClass = isBestExit ? 'flex z-50' : 'hidden md:flex';

                            const combinedHtml = `
                                <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer group z-50">
                                    <div class="absolute inset-0 flex items-center justify-center transition-transform" style="transform: scale(${pinScale});">
                                        ${shouldPulse ? `<span class="absolute inline-flex h-full w-full rounded-full ${statusColorBg} opacity-50 animate-ping z-0"></span>` : ''}
                                        <span class="relative inline-flex rounded-full h-4 w-4 ${statusColorBg} border-2 border-white shadow-md z-10"></span>
                                    </div>
                                    <div class="absolute left-8 ml-1 ${displayClass} items-center shadow-lg rounded-full overflow-hidden border-2 ${isBestExit || isSelected ? `border-[${statusColorBg}] scale-110` : 'border-white'} w-max transition-transform">
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
        </div>
    );
}
