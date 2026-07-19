// ============================================================================
// HOOK: useGateTelemetry
// PURPOSE: This is the single source of truth for hardware data. 
// Currently, it loads mock data. Later, this is where we will add the 
// Supabase Realtime WebSocket listener to push live ESP32 updates to the UI.
// ============================================================================

import { useState, useEffect } from 'react';
import { gateData as initialMockData } from '../data/mockData';

export function useGateTelemetry() {
    // State to hold the current readings of all 4 gates
    const [telemetry, setTelemetry] = useState(initialMockData);

    // State to track if the WebSocket connection is active
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        // ------------------------------------------------------------------------
        // HARDWARE INTEGRATION HOOK (COMING SOON)
        // ------------------------------------------------------------------------
        // When the backend is ready, we will add the Supabase listener here:
        // 
        // const channel = supabase.channel('public:gate_telemetry')
        //   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'gate_telemetry' }, 
        //     (payload) => {
        //        // 1. Parse the incoming JSON from the Python script
        //        // 2. setTelemetry(newData) to instantly update the UI
        //   })
        //   .subscribe((status) => {
        //      if (status === 'SUBSCRIBED') setIsLive(true);
        //   });
        // ------------------------------------------------------------------------

        // For now, we simulate a successful connection
        setIsLive(true);

        // Cleanup function when the component unmounts
        return () => {
            // supabase.removeChannel(channel);
        };
    }, []); // The empty array ensures this listener is only created once on load

    return { telemetry, isLive };
}