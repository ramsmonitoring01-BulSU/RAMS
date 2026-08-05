// utils/geoData.js
export const campusGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        // --- SPLIT LOVERS LANE TO ALLOW INTERSECTIONS ---
        { "type": "Feature", "properties": { "id": "segment-1a", "name": "Lovers Lane A", "startNode": "Gate-1", "endNode": "Lovers Lane Intersect A" }, "geometry": { "type": "LineString", "coordinates": [[120.8121593, 14.8571258], [120.8127471, 14.8576293]] } },
        { "type": "Feature", "properties": { "id": "segment-1b", "name": "Lovers Lane B", "startNode": "Lovers Lane Intersect A", "endNode": "Lovers Lane Intersect B" }, "geometry": { "type": "LineString", "coordinates": [[120.8127471, 14.8576293], [120.8130412, 14.8578812]] } },
        { "type": "Feature", "properties": { "id": "segment-1c", "name": "Lovers Lane C", "startNode": "Lovers Lane Intersect B", "endNode": "E-Library" }, "geometry": { "type": "LineString", "coordinates": [[120.8130412, 14.8578812], [120.8135136, 14.8582858]] } },

        // --- REST OF THE MAIN ROADS ---
        { "type": "Feature", "properties": { "id": "segment-2", "name": "E-Library Driveway", "startNode": "E-Library", "endNode": "COE-COED Intersection" }, "geometry": { "type": "LineString", "coordinates": [[120.8135136, 14.8582858], [120.813894, 14.8578823], [120.8140458, 14.857658], [120.8141381, 14.857555]] } },
        { "type": "Feature", "properties": { "id": "segment-3", "name": "Engineering Driveway", "startNode": "COE-COED Intersection", "endNode": "Gate-2" }, "geometry": { "type": "LineString", "coordinates": [[120.8141381, 14.857555], [120.8143218, 14.8573497], [120.8143525, 14.8573222]] } },
        { "type": "Feature", "properties": { "id": "segment-4", "name": "COE Driveway to CS", "startNode": "COE-COED Intersection", "endNode": "CS Intersection" }, "geometry": { "type": "LineString", "coordinates": [[120.8141381, 14.857555], [120.8145054, 14.8578796]] } },
        { "type": "Feature", "properties": { "id": "segment-5", "name": "CS-Valencia Hall Driveway", "startNode": "CS Intersection", "endNode": "CSSP-CCJE Intersection" }, "geometry": { "type": "LineString", "coordinates": [[120.8145054, 14.8578796], [120.8145822, 14.8578146], [120.8154208, 14.8584862]] } },
        { "type": "Feature", "properties": { "id": "segment-6", "name": "CCJE-Gate 3", "startNode": "CSSP-CCJE Intersection", "endNode": "Gate-3" }, "geometry": { "type": "LineString", "coordinates": [[120.8154208, 14.8584862], [120.8159184, 14.8579663], [120.8159917, 14.8578997]] } },
        { "type": "Feature", "properties": { "id": "segment-7", "name": "CSSP-Gate 4", "startNode": "CSSP-CCJE Intersection", "endNode": "Gate-4" }, "geometry": { "type": "LineString", "coordinates": [[120.8154208, 14.8584862], [120.8143474, 14.8596704], [120.81428, 14.8597547]] } },

        // --- INTERNAL ROUTES ---
        { "type": "Feature", "properties": { "id": "segment-8", "name": "Activity Center Alley", "startNode": "Lovers Lane Intersect A", "endNode": "CON Intersect" }, "geometry": { "type": "LineString", "coordinates": [[120.8127471, 14.8576293], [120.813302, 14.8570657]] } },
        { "type": "Feature", "properties": { "id": "segment-9", "name": "CON Driveway", "startNode": "CON Intersect", "endNode": "CLAW Intersect" }, "geometry": { "type": "LineString", "coordinates": [[120.813302, 14.8570657], [120.813577, 14.8573292]] } },
        { "type": "Feature", "properties": { "id": "segment-10", "name": "CLAW Driveway", "startNode": "CLAW Intersect", "endNode": "Lovers Lane Intersect B" }, "geometry": { "type": "LineString", "coordinates": [[120.813577, 14.8573292], [120.8130412, 14.8578812]] } },

        // --- BUILDINGS (Now perfectly snapped to the new segments) ---
        { "type": "Feature", "properties": { "id": "CON", "name": "Pimentel Hall", "nearestnode": "segment-9" }, "geometry": { "type": "Point", "coordinates": [120.8134533, 14.8570019] } },
        { "type": "Feature", "properties": { "id": "activity-center", "name": "Activity Center", "nearestnode": "segment-1a" }, "geometry": { "type": "Point", "coordinates": [120.8128729, 14.8572462] } },
        { "type": "Feature", "properties": { "id": "CIT", "name": "Alvarado Hall", "nearestnode": "segment-1b" }, "geometry": { "type": "Point", "coordinates": [120.8125908, 14.8577221] } },
        { "type": "Feature", "properties": { "id": "NSTP", "name": "Athletes Bldg", "nearestnode": "segment-9" }, "geometry": { "type": "Point", "coordinates": [120.8135861, 14.8568841] } },
        { "type": "Feature", "properties": { "id": "CLAW", "name": "College of Law", "nearestnode": "segment-10" }, "geometry": { "type": "Point", "coordinates": [120.8134007, 14.8577014] } },
        { "type": "Feature", "properties": { "id": "LHS", "name": "Carpio Hall", "nearestnode": "segment-2" }, "geometry": { "type": "Point", "coordinates": [120.8135918, 14.8577896] } },
        { "type": "Feature", "properties": { "id": "SRLC", "name": "SRLC Bldg", "nearestnode": "segment-2" }, "geometry": { "type": "Point", "coordinates": [120.81382, 14.8582197] } },
        { "type": "Feature", "properties": { "id": "elibrary", "name": "E-Library", "nearestnode": "segment-2" }, "geometry": { "type": "Point", "coordinates": [120.8136431, 14.8583933] } },
        { "type": "Feature", "properties": { "id": "CBEA", "name": "CBEA Bldg", "nearestnode": "segment-2" }, "geometry": { "type": "Point", "coordinates": [120.8139141, 14.8581149] } },
        { "type": "Feature", "properties": { "id": "COE", "name": "Natividad Hall", "nearestnode": "segment-3" }, "geometry": { "type": "Point", "coordinates": [120.8143105, 14.8576518] } },
        { "type": "Feature", "properties": { "id": "COED", "name": "Pimentel Hall (COED)", "nearestnode": "segment-3" }, "geometry": { "type": "Point", "coordinates": [120.8140572, 14.8574618] } },
        { "type": "Feature", "properties": { "id": "CHTM", "name": "CHTM Bldg", "nearestnode": "segment-1c" }, "geometry": { "type": "Point", "coordinates": [120.8132678, 14.858305] } },
        { "type": "Feature", "properties": { "id": "CS-CAL", "name": "Federizo Hall", "nearestnode": "segment-5" }, "geometry": { "type": "Point", "coordinates": [120.8145583, 14.8580423] } },
        { "type": "Feature", "properties": { "id": "floreshall", "name": "Flores Hall", "nearestnode": "segment-5" }, "geometry": { "type": "Point", "coordinates": [120.8150639, 14.8580354] } },
        { "type": "Feature", "properties": { "id": "valenciahall", "name": "Valencia Hall", "nearestnode": "segment-5" }, "geometry": { "type": "Point", "coordinates": [120.8152771, 14.8581468] } },
        { "type": "Feature", "properties": { "id": "CSSP", "name": "Mendoza Hall", "nearestnode": "segment-7" }, "geometry": { "type": "Point", "coordinates": [120.8149063, 14.8591917] } },
        { "type": "Feature", "properties": { "id": "CCJE", "name": "CCJE Bldg", "nearestnode": "segment-6" }, "geometry": { "type": "Point", "coordinates": [120.8157052, 14.858301] } }
    ]
};