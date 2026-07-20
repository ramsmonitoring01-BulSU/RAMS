// ============================================================================
// MOCK DATA: Static fallback for UI testing before Supabase is connected.
// Coordinates are pre-set for the Malolos campus layout.
// ============================================================================

export const MOCK_GATE_DATA = {
    1: { id: 1, name: 'Gate 1', location: 'Main Entrance', level: 0, battery: '12.4V', ping: '24ms', status: 'Safe', lat: 14.857244, lng: 120.812329 },
    2: { id: 2, name: 'Gate 2', location: 'East Wing', level: 18, battery: '12.1V', ping: '32ms', status: 'Warning', lat: 14.857345, lng: 120.814304 },
    3: { id: 3, name: 'Gate 3', location: 'West Annex', level: 38, battery: '11.8V', ping: '45ms', status: 'Impassable', lat: 14.858024, lng: 120.815839 },
    4: { id: 4, name: 'Gate 4', location: 'Back Service', level: 5, battery: '12.5V', ping: '20ms', status: 'Safe', lat: 14.859670, lng: 120.814367 },
};