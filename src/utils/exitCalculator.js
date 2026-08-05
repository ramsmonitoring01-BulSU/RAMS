// utils/exitCalculator.js
import { campusGeoJSON } from './geoData';

// Helper to calculate physical distance between coordinates
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

    const vehicleThresholds = { 'human': 30, 'ebike': 10, 'motorbike': 20, 'sedan': 15 };
    const vehicleKey = String(selectedVehicle).toLowerCase().replace(/[^a-z0-9]/g, '');
    const threshold = vehicleThresholds[vehicleKey] || 15;

    // 1. Build the Road Network Graph
    const graph = {};
    const segments = campusGeoJSON.features.filter(f => f.geometry.type === 'LineString');

    segments.forEach(seg => {
        const start = seg.properties.startNode, end = seg.properties.endNode, id = seg.properties.id;
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

    // 2. Find Origin Node based on the Selected Building
    const buildingFeature = campusGeoJSON.features.find(f => f.properties.id === selectedBuilding);
    if (!buildingFeature) return null;

    const targetSegmentId = buildingFeature.properties.nearestnode;
    const targetSegment = segments.find(s => s.properties.id === targetSegmentId);
    if (!targetSegment) return null;

    const originNode = targetSegment.properties.startNode;

    // 3. Run Dijkstra's Algorithm
    const distances = {}, previous = {};
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

    // 4. Evaluate the 4 Gates to find the Best Exit
    const gateMapping = { 1: "Gate-1", 2: "Gate-2", 3: "Gate-3", 4: "Gate-4" };
    let bestGate = null, shortestSafeDist = Infinity;
    let fallbackGate = null, lowestWaterLevel = Infinity;

    Object.values(gateData).forEach(gate => {
        const gateNode = gateMapping[gate.id];
        const dist = distances[gateNode];
        const isSafe = gate.level <= threshold;

        if (gate.level < lowestWaterLevel) {
            lowestWaterLevel = gate.level;
            fallbackGate = { ...gate, isSafe: false };
        }
        if (isSafe && dist < shortestSafeDist) {
            shortestSafeDist = dist;
            bestGate = { ...gate, isSafe: true };
        }
    });

    const finalExit = bestGate || fallbackGate;
    if (!finalExit) return null;

    // 5. Trace the path back to the origin
    const pathSegments = [targetSegmentId]; // Always include the building's driveway
    let curr = gateMapping[finalExit.id];
    while (curr !== originNode) {
        if (!previous[curr]) break;
        pathSegments.push(previous[curr].segmentId);
        curr = previous[curr].node;
    }

    return {
        id: finalExit.id,
        level: finalExit.level,
        isSafe: finalExit.isSafe,
        routeSegments: [...new Set(pathSegments)] // Remove duplicates
    };
}