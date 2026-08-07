// utils/exitCalculator.js
import { campusGeoJSON } from './geoData';

// Helper to calculate physical distance between coordinates [lng, lat]
function calculateDistance(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getBestExit(gateData, selectedVehicle, selectedBuilding) {
    if (!gateData || !selectedVehicle || !selectedBuilding) return null;

    // Standardized vehicle thresholds to match VehicleClearance.jsx
    const vehicleKey = String(selectedVehicle).toLowerCase();
    let threshold = 15; // default (sedan)

    if (vehicleKey.includes('human') || vehicleKey.includes('walk')) threshold = 30;
    if (vehicleKey.includes('ebike') || vehicleKey.includes('bike')) threshold = 10;
    if (vehicleKey.includes('motorbike') || vehicleKey.includes('motor')) threshold = 20;
    if (vehicleKey.includes('sedan') || vehicleKey.includes('car')) threshold = 15;

    // 1. Build the Road Network Graph
    const graph = {};
    const segments = campusGeoJSON.features.filter(f => f.geometry && f.geometry.type === 'LineString');

    segments.forEach(seg => {
        const start = seg.properties.startNode;
        const end = seg.properties.endNode;
        const id = seg.properties.id;
        const coords = seg.geometry.coordinates;

        let dist = 0;
        for (let i = 0; i < coords.length - 1; i++) {
            dist += calculateDistance(coords[i], coords[i + 1]);
        }

        if (!graph[start]) graph[start] = [];
        if (!graph[end]) graph[end] = [];

        graph[start].push({ node: end, segmentId: id, distance: dist });
        graph[end].push({ node: start, segmentId: id, distance: dist });
    });

    // 2. Find Origin Node directly from user's manual mapping
    const buildingFeature = campusGeoJSON.features.find(f => f.properties.id === selectedBuilding);
    if (!buildingFeature) return null;

    const originNode = buildingFeature.properties.nearestnode;
    if (!graph[originNode]) return null;

    // 3. Run Dijkstra's Algorithm
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(graph));

    unvisited.forEach(n => { distances[n] = Infinity; previous[n] = null; });
    distances[originNode] = 0;

    while (unvisited.size > 0) {
        let minNode = null;
        unvisited.forEach(node => {
            if (minNode === null || distances[node] < distances[minNode]) minNode = node;
        });

        if (minNode === null || distances[minNode] === Infinity) break;
        unvisited.delete(minNode);

        if (graph[minNode]) {
            graph[minNode].forEach(neighbor => {
                let alt = distances[minNode] + neighbor.distance;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    previous[neighbor.node] = { node: minNode, segmentId: neighbor.segmentId };
                }
            });
        }
    }

    // 4. Rank the Gates and Apply Clearance Logic
    const gateMapping = { 1: "Gate-1", 2: "Gate-2", 3: "Gate-3", 4: "Gate-4" };

    const evaluatedGates = Object.values(gateData).map(gate => {
        const gateNode = gateMapping[gate.id];
        const dist = distances[gateNode];

        // Exact matching logic from VehicleClearance container
        const isImpassable = gate.level >= threshold;
        const isWarning = gate.level >= (threshold - 5) && !isImpassable;

        let routeStatus = 'safe';
        if (isImpassable) routeStatus = 'impassable';
        else if (isWarning) routeStatus = 'warning';

        const isSafe = !isImpassable;

        return { ...gate, gateNode, dist, isSafe, routeStatus };
    }).filter(g => g.dist !== Infinity && g.dist !== undefined);

    // Sort to find the absolute best gate
    evaluatedGates.sort((a, b) => {
        // Rule 1: Safe gates beat impassable gates
        if (a.isSafe !== b.isSafe) return a.isSafe ? -1 : 1;

        // Rule 2: If both are safe/unsafe, pick the one with the lowest water level
        if (a.level !== b.level) return a.level - b.level;

        // Rule 3: If water levels are identical, pick the closer one
        return a.dist - b.dist;
    });

    const finalExit = evaluatedGates[0];
    if (!finalExit) return null;

    // 5. Trace the exact path back to the origin
    const pathSegments = [];
    let curr = finalExit.gateNode;

    while (curr !== originNode) {
        if (!previous[curr]) break;
        pathSegments.push(previous[curr].segmentId);
        curr = previous[curr].node;
    }

    return {
        id: finalExit.id,
        level: finalExit.level,
        isSafe: finalExit.isSafe,
        routeStatus: finalExit.routeStatus, // Passed to the map for color coding
        routeSegments: pathSegments
    };
}