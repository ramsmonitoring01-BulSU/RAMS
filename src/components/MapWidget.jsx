// components/MapWidget.jsx
import React, { useState, useEffect } from 'react';
import { Map, ShieldAlert, ShieldCheck, Shield, Crosshair, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { campusGeoJSON } from '../utils/geoData';

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

export default function MapWidget({ gateData, selectedGate, handleGateClick, bestExit, selectedBuilding, selectedVehicle }) {
    const [userPosition, setUserPosition] = useState(null);
    const [userAccuracy, setUserAccuracy] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locateTrigger, setLocateTrigger] = useState(null);

    // Handle GPS Button Click
    const handleFindMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                const newCoords = [latitude, longitude];
                setUserPosition(newCoords);
                setUserAccuracy(accuracy);
                setLocateTrigger(newCoords); // Triggers flyTo in LocationController
                setIsLocating(false);
            },
            (err) => {
                console.error("Error getting location: ", err.message);
                alert("Unable to retrieve your location. Please check permissions.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    if (!gateData || !campusGeoJSON) {
        return (
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center w-full h-full min-h-[400px] lg:min-h-0">
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

    // User GPS Marker Icon
    const userIcon = L.divIcon({
        className: 'bg-transparent',
        html: `
            <div class="relative flex items-center justify-center w-6 h-6">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 border-2 border-white shadow-md"></span>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col w-full h-full min-h-[400px] lg:min-h-0">

            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-card-dark shrink-0 z-10">
                <h2 className="text-base font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                    <Map size={18} className="text-[#2563EB]" /> Live Navigation Map
                </h2>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] dark:text-emerald-400 text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                </span>
            </div>

            <div className="flex-1 relative w-full z-0 bg-slate-50 dark:bg-slate-900">

                {/* TOP-RIGHT GPS TARGET BUTTON */}
                <button
                    onClick={handleFindMe}
                    disabled={isLocating}
                    title="Find My Location"
                    className="absolute top-4 right-4 z-[1000] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 flex items-center justify-center cursor-pointer group"
                >
                    {isLocating ? (
                        <Loader2 size={20} className="text-blue-500 animate-spin" />
                    ) : (
                        <Crosshair size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                    )}
                </button>

                {/* Gate Status Legend (Desktop) */}
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

                {/* Mobile Gate Carousel */}
                <div className="md:hidden absolute bottom-4 left-0 right-0 w-full z-[1000] px-3 pointer-events-none">
                    <div className="flex gap-2 overflow-x-auto snap-x pb-2 pointer-events-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {gates.map(gate => {
                            if (!gate) return null;
                            let dotColor = 'bg-[#10B981]';
                            let pulse = '';
                            if (gate.status === 'Warning') { dotColor = 'bg-[#F59E0B]'; pulse = 'animate-pulse'; }
                            if (gate.status === 'Impassable') { dotColor = 'bg-[#F43F5E]'; pulse = 'animate-pulse'; }

                            const isSelected = selectedGate === gate.id;
                            const borderStyle = isSelected ? 'border-[#2563EB] bg-blue-50/95 dark:bg-blue-900/40' : 'border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90';

                            return (
                                <button
                                    key={gate.id}
                                    onClick={() => handleGateClick(gate.id)}
                                    className={`flex-none snap-center backdrop-blur-md border rounded-xl px-3 py-2 shadow-lg flex flex-col items-start min-w-[90px] transition-all duration-200 ${borderStyle}`}
                                >
                                    <div className="flex justify-between w-full items-center mb-1">
                                        <span className={`text-[10px] font-sans font-bold uppercase tracking-wide ${isSelected ? 'text-[#2563EB]' : 'text-slate-500'}`}>{gate.name}</span>
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} ${pulse}`}></span>
                                    </div>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-lg font-mono font-bold text-slate-800 dark:text-white leading-none">{gate.level}</span>
                                        <span className="text-[9px] font-sans text-slate-500">cm</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="absolute inset-0">
                    <MapContainer center={mapCenter} zoom={16} minZoom={15} maxBounds={[southWest, northEast]} maxBoundsViscosity={0.8} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" maxNativeZoom={19} />

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
                            if (bestExit.routeStatus === 'warning') lineColor = "#F59E0B";
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

                        {gates.map(gate => {
                            if (!gate) return null;
                            const isSelected = selectedGate === gate.id;
                            const isBestExit = bestExit && bestExit.id === gate.id;
                            let statusColorBg = 'bg-[#10B981]';

                            if (gate.status === 'Warning') statusColorBg = 'bg-[#F59E0B]';
                            else if (gate.status === 'Impassable') statusColorBg = 'bg-[#F43F5E]';

                            if (isBestExit) {
                                if (bestExit.routeStatus === 'safe') statusColorBg = 'bg-[#3B82F6]';
                                else if (bestExit.routeStatus === 'warning') statusColorBg = 'bg-[#F59E0B]';
                                else if (bestExit.routeStatus === 'impassable') statusColorBg = 'bg-[#F43F5E]';
                            }

                            const shouldPulse = isBestExit || gate.status !== 'Passable';
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