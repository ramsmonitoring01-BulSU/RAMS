// Dito indicated yung location ng points for the buildings (latitude and longitude)
// Pati yung sa segments nung map included din 
export const campusGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        // === BUILDINGS ===
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.813453, 14.857002] }, "properties": { "id": "CON", "name": "Pimentel Hall", "nearestnode": "CON" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.812915, 14.857242] }, "properties": { "id": "activity-center", "name": "Activity Center", "nearestnode": "Activity Center" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.81268, 14.857676] }, "properties": { "id": "CIT", "name": "Alvarado Hall", "nearestnode": "CIT" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.813592, 14.85779] }, "properties": { "id": "LHS", "name": "Carpio Hall", "nearestnode": "CBEA" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.813643, 14.858393] }, "properties": { "id": "elibrary", "name": "E-Library", "nearestnode": "E-Library" } },

        // === FIXED: SRLC & CBEA Coordinates Swapped ===
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.813817, 14.858228] }, "properties": { "id": "SRLC", "name": "SRLC Bldg", "nearestnode": "CBEA" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.813914, 14.858115] }, "properties": { "id": "CBEA", "name": "CBEA Bldg", "nearestnode": "CBEA" } },

        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.81328, 14.858275] }, "properties": { "id": "CHTM", "name": "CHTM Bldg", "nearestnode": "CHTM" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.814698, 14.858476] }, "properties": { "id": "CS-CAL", "name": "Federizo Hall", "nearestnode": "VALENCIA" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.815277, 14.858147] }, "properties": { "id": "valenciahall", "name": "Valencia Hall", "nearestnode": "VALENCIA" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.814057, 14.857462] }, "properties": { "id": "COED", "name": "Roxas Hall", "nearestnode": "COED" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.814906, 14.859192] }, "properties": { "id": "CSSP", "name": "Mendoza Hall", "nearestnode": "CSSP" } },
        { "type": "Feature", "geometry": { "type": "Point", "coordinates": [120.815705, 14.858301] }, "properties": { "id": "CCJE", "name": "CCJE Bldg", "nearestnode": "CCJE" } },
        { "type": "Feature", "properties": { "id": "COE", "name": "Natividad Hall", "nearestnode": "COE" }, "geometry": { "type": "Point", "coordinates": [120.814518, 14.857699] } },
        { "type": "Feature", "properties": { "id": "floreshall", "name": "Flores Hall", "nearestnode": "FLORES" }, "geometry": { "type": "Point", "coordinates": [120.815051, 14.857806] } },
        { "type": "Feature", "properties": { "id": "CLAW", "name": "CLAW Bldg", "nearestnode": "CLAW" }, "geometry": { "type": "Point", "coordinates": [120.813408, 14.857682] } },

        // === NEW: NSTP Building Added ===
        { "type": "Feature", "properties": { "id": "NSTP", "name": "Athletes Bldg", "nearestnode": "CON Canteen" }, "geometry": { "type": "Point", "coordinates": [120.8135746, 14.8568761] } },

        // === ROAD SEGMENTS ===
        { "type": "Feature", "properties": { "id": "segment-1", "name": "G1-CIT Node", "startNode": "Gate-1", "endNode": "CIT" }, "geometry": { "type": "LineString", "coordinates": [[120.812169, 14.857131], [120.812748, 14.857626]] } },
        { "type": "Feature", "properties": { "id": "segment-2", "name": "Lovers Lane", "startNode": "CIT", "endNode": "Rizal-CLAW Corner" }, "geometry": { "type": "LineString", "coordinates": [[120.812748, 14.857626], [120.813044, 14.857879]] } },
        { "type": "Feature", "properties": { "id": "segment-3", "name": "CIT-AC Node", "startNode": "CIT", "endNode": "Activity Center" }, "geometry": { "type": "LineString", "coordinates": [[120.812748, 14.857626], [120.813012, 14.857352]] } },
        { "type": "Feature", "properties": { "id": "segment-4", "name": "CON to AC", "startNode": "Activity Center", "endNode": "CON" }, "geometry": { "type": "LineString", "coordinates": [[120.813012, 14.857352], [120.813301, 14.857067], [120.813361, 14.857125]] } },
        { "type": "Feature", "properties": { "id": "segment-5", "name": "CON-CON Canteen Node", "startNode": "CON", "endNode": "CON Canteen" }, "geometry": { "type": "LineString", "coordinates": [[120.813361, 14.857125], [120.813574, 14.85733]] } },
        { "type": "Feature", "properties": { "id": "segment-6", "name": "CON Canteen-CLAW Node", "startNode": "CON Canteen", "endNode": "CLAW" }, "geometry": { "type": "LineString", "coordinates": [[120.813574, 14.85733], [120.813317, 14.857594]] } },
        { "type": "Feature", "properties": { "id": "segment-7", "name": "CLAW-Rizal-CLAW Corner Node", "startNode": "CLAW", "endNode": "Rizal-CLAW Corner" }, "geometry": { "type": "LineString", "coordinates": [[120.813317, 14.857594], [120.813044, 14.857879]] } },
        { "type": "Feature", "properties": { "id": "segment-8", "name": "Rizal-CLAW Corner-CHTM Node", "startNode": "Rizal-CLAW Corner", "endNode": "CHTM" }, "geometry": { "type": "LineString", "coordinates": [[120.813044, 14.857879], [120.813377, 14.858168]] } },
        { "type": "Feature", "properties": { "id": "segment-9", "name": "CHTM-E-Library Node", "startNode": "CHTM", "endNode": "E-Library" }, "geometry": { "type": "LineString", "coordinates": [[120.813377, 14.858168], [120.813512, 14.858286], [120.813546, 14.858251]] } },
        { "type": "Feature", "properties": { "id": "segment-10", "name": "E-Library-CBEA Node", "startNode": "E-Library", "endNode": "CBEA" }, "geometry": { "type": "LineString", "coordinates": [[120.813546, 14.858251], [120.813728, 14.858059]] } },
        { "type": "Feature", "properties": { "id": "segment-11", "name": "CBEA-COED Node", "startNode": "CBEA", "endNode": "COED" }, "geometry": { "type": "LineString", "coordinates": [[120.813728, 14.858059], [120.813895, 14.857881], [120.814041, 14.857664]] } },

        // === FIXED: Segment 12 split to create the intersection for Segment 13 ===
        { "type": "Feature", "properties": { "id": "segment-12a", "name": "COED to Intersection", "startNode": "COED", "endNode": "COED-Gate-2 Node" }, "geometry": { "type": "LineString", "coordinates": [[120.814041, 14.857664], [120.8141363, 14.8575578]] } },
        { "type": "Feature", "properties": { "id": "segment-12b", "name": "Intersection to Gate 2", "startNode": "COED-Gate-2 Node", "endNode": "Gate-2" }, "geometry": { "type": "LineString", "coordinates": [[120.8141363, 14.8575578], [120.81436, 14.857308]] } },

        // === UPDATED: Segment 13 as requested ===
        { "type": "Feature", "properties": { "id": "segment-13", "name": "COED-COE Node", "startNode": "COED-Gate-2 Node", "endNode": "COE" }, "geometry": { "type": "LineString", "coordinates": [[120.8141363, 14.8575578], [120.8145075, 14.8578818], [120.8145833, 14.8578125]] } },

        { "type": "Feature", "properties": { "id": "segment-14", "name": "COE-FLORES Node", "startNode": "COE", "endNode": "FLORES" }, "geometry": { "type": "LineString", "coordinates": [[120.814583, 14.857813], [120.814833, 14.858004]] } },
        { "type": "Feature", "properties": { "id": "segment-15", "name": "FLORES-VALENCIA Node", "startNode": "FLORES", "endNode": "VALENCIA" }, "geometry": { "type": "LineString", "coordinates": [[120.814833, 14.858004], [120.815186, 14.858294]] } },
        { "type": "Feature", "properties": { "id": "segment-16", "name": "VALENCIA-CCJE Node", "startNode": "VALENCIA", "endNode": "CCJE" }, "geometry": { "type": "LineString", "coordinates": [[120.815186, 14.858294], [120.815417, 14.858484], [120.815648, 14.858246]] } },
        { "type": "Feature", "properties": { "id": "segment-17", "name": "VALENCIA-CSSP Node", "startNode": "VALENCIA", "endNode": "CSSP" }, "geometry": { "type": "LineString", "coordinates": [[120.815186, 14.858294], [120.81542, 14.858484], [120.814831, 14.859134]] } },
        { "type": "Feature", "properties": { "id": "segment-18", "name": "CCJE-Gate-3 Node", "startNode": "CCJE", "endNode": "Gate-3" }, "geometry": { "type": "LineString", "coordinates": [[120.815648, 14.858246], [120.815921, 14.857964], [120.815993, 14.857898]] } },
        { "type": "Feature", "properties": { "id": "segment-19", "name": "CSSP-Gate-4 Node", "startNode": "CSSP", "endNode": "Gate-4" }, "geometry": { "type": "LineString", "coordinates": [[120.814831, 14.859134], [120.814313, 14.859708], [120.814281, 14.85975]] } }
    ]
};