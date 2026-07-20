import React from 'react';
import { Map } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapWidget({ gateData, activeGate, setActiveGate }) {
    const mapCenter = [14.8565, 120.8140];
    const gates = Object.values(gateData);

    return (
        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-full transition-colors duration-300">

            {/* Map Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-card-dark shrink-0 transition-colors z-10">
                <h2 className="text-base font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                    <Map size={18} className="text-[#2563EB] dark:text-brand-light" /> Live Campus Map
                </h2>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] dark:text-emerald-400 text-[10px] font-sans font-bold px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
                </span>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative w-full h-full z-0">
                <MapContainer
                    center={mapCenter}
                    zoom={17}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {gates.map((gate) => {
                        const isActive = activeGate === gate.id;

                        // 1. Determine Color and Alert Status
                        let nodeColor = '#10B981'; // Green (Safe)
                        let isAlert = false; // Flag to trigger the pulse animation

                        if (gate.status === 'Warning') {
                            nodeColor = '#F59E0B'; // Amber
                            isAlert = true;
                        }
                        if (gate.status === 'Impassable') {
                            nodeColor = '#F43F5E'; // Red
                            isAlert = true;
                        }

                        return (
                            <CircleMarker
                                key={gate.id}
                                center={[gate.lat, gate.lng]}
                                radius={isActive ? 12 : 8}
                                pathOptions={{
                                    color: isActive ? '#2563EB' : nodeColor,
                                    fillColor: nodeColor,
                                    fillOpacity: 0.8,
                                    weight: isActive ? 4 : 2,
                                    // 2. Inject Tailwind's pulse class directly into the Leaflet SVG if it's an alert
                                    className: isAlert ? 'animate-pulse' : 'transition-all duration-300'
                                }}
                                eventHandlers={{
                                    click: () => setActiveGate(gate.id),
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={isActive}>
                                    <div className="text-center font-sans">
                                        <div className="font-bold text-slate-800">{gate.name}</div>
                                        <div className="text-[10px] text-slate-500">{gate.level}cm</div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>

        </div>
    );
}