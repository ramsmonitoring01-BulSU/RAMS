import React from 'react';
import { Map } from 'lucide-react';
// 1. Swapped CircleMarker for standard Marker, and imported L for custom icons
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapWidget({ gateData, activeGate, setActiveGate }) {
    const mapCenter = [14.8565, 120.8140];
    const gates = Object.values(gateData);

    // Invisible boundary box to lock the camera to the campus
    const southWest = [14.8520, 120.8080];
    const northEast = [14.8620, 120.8200];
    const campusBounds = [southWest, northEast];

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
                    minZoom={16}
                    maxBounds={campusBounds}
                    maxBoundsViscosity={1.0}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {gates.map((gate) => {
                        const isActive = activeGate === gate.id;

                        // 2. Dynamic Tailwind styling for the custom HTML markers
                        let dotColor = 'bg-[#10B981]'; // Green
                        let ringColor = 'bg-[#10B981]';
                        let isAlert = false;

                        if (gate.status === 'Warning') {
                            dotColor = 'bg-[#F59E0B]'; // Amber
                            ringColor = 'bg-[#F59E0B]';
                            isAlert = true;
                        } else if (gate.status === 'Impassable') {
                            dotColor = 'bg-[#F43F5E]'; // Red
                            ringColor = 'bg-[#F43F5E]';
                            isAlert = true;
                        }

                        // Make the active gate visually distinct if it is not in an alert state
                        if (isActive && !isAlert) {
                            dotColor = 'bg-[#2563EB]'; // Blue
                            ringColor = 'bg-[#2563EB]';
                        }

                        // Alerts always pulse. Active safe gates also pulse to show they are selected.
                        const shouldPulse = isAlert || isActive;

                        // 3. The raw HTML string injected into the map
                        const markerHtml = `
                            <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
                                ${shouldPulse ? `<span class="absolute inline-flex h-full w-full rounded-full ${ringColor} opacity-50 animate-ping"></span>` : ''}
                                <span class="relative inline-flex rounded-full ${isActive ? 'h-5 w-5' : 'h-4 w-4'} ${dotColor} border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300"></span>
                            </div>
                        `;

                        // 4. Create the Leaflet DivIcon
                        const customIcon = L.divIcon({
                            className: '', // Setting this to empty removes the default Leaflet white square background
                            html: markerHtml,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16], // Centers the icon perfectly on the coordinates
                        });

                        return (
                            <Marker
                                key={gate.id}
                                position={[gate.lat, gate.lng]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => setActiveGate(gate.id),
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={1} >
                                    <div className="text-center font-sans">
                                        <div className="font-bold text-slate-800">{gate.name}</div>
                                        <div className="text-[10px] text-slate-500">{gate.level}cm</div>
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

        </div>
    );
}