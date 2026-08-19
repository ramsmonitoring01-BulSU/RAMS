// Smart routing feature, kasama yung mini-algorithm for path finding

export function findBestRoute(origin, destination, selectedVehicle, vehicleThresholds, gateData, campusRoutes) {
    if (!origin || !destination || !selectedVehicle) return [];

    // Normalize string keys (handles 'ebike', 'e-bike', 'E-Bike')
    const vehicleKey = String(selectedVehicle).toLowerCase().replace(/[^a-z0-9]/g, '');

    // Look up threshold with fallbacks
    const threshold = vehicleThresholds[vehicleKey] || vehicleThresholds[selectedVehicle] || 10;
    const warningThreshold = Math.max(0, threshold - 5);

    const nodes = [1, 2, 3, 4];

    // 1. Build Network Graph using Penalty Weights
    const graph = {};
    nodes.forEach(n => graph[n] = []);

    campusRoutes.forEach(route => {
        if (!route.connectedGates) return;

        const [u, v] = route.connectedGates;
        const levelU = gateData[u] ? gateData[u].level : (gateData[String(u)] ? gateData[String(u)].level : 0);
        const levelV = gateData[v] ? gateData[v].level : (gateData[String(v)] ? gateData[String(v)].level : 0);
        const maxWaterLevel = Math.max(levelU, levelV);

        // Assign penalty weights instead of excluding roads:
        // Safe = 1 | Warning = 50 | Impassable = 1000
        let cost = 1;
        if (maxWaterLevel >= threshold) {
            cost = 1000; // Impassable penalty (used only if no dry route exists)
        } else if (maxWaterLevel >= warningThreshold) {
            cost = 50;   // Warning penalty
        }

        graph[u].push({ node: v, routeId: route.id, cost: cost });
        graph[v].push({ node: u, routeId: route.id, cost: cost });
    });

    // 2. Dijkstra's Pathfinding Algorithm
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes);

    nodes.forEach(n => {
        distances[n] = Infinity;
        previous[n] = null;
    });
    distances[origin] = 0;

    while (unvisited.size > 0) {
        let minNode = null;
        unvisited.forEach(node => {
            if (minNode === null || distances[node] < distances[minNode]) {
                minNode = node;
            }
        });

        if (minNode === null || distances[minNode] === Infinity) break;
        if (minNode === destination) break;

        unvisited.delete(minNode);

        if (graph[minNode]) {
            graph[minNode].forEach(neighbor => {
                const alt = distances[minNode] + neighbor.cost;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    previous[neighbor.node] = { node: minNode, routeId: neighbor.routeId };
                }
            });
        }
    }

    // 3. Reconstruct Route
    const pathRouteIds = [];
    let curr = destination;

    if (previous[curr] || curr === origin) {
        while (curr !== origin) {
            if (!previous[curr]) return [];
            pathRouteIds.unshift(previous[curr].routeId);
            curr = previous[curr].node;
        }
    }

    return pathRouteIds;
}