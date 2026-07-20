import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 1. STATIC BASE DATA: We keep the GPS coordinates and names hardcoded here
// because the ESP32 doesn't need to waste bandwidth sending data that never changes.
const BASE_GATE_DATA = {
    1: { id: 1, name: 'Gate 1', location: 'Main Entrance', level: 0, battery: '12.4V', ping: '24ms', status: 'Safe', lat: 14.857244, lng: 120.812329 },
    2: { id: 2, name: 'Gate 2', location: 'East Wing', level: 18, battery: '12.1V', ping: '32ms', status: 'Warning', lat: 14.857345, lng: 120.814304 },
    3: { id: 3, name: 'Gate 3', location: 'West Annex', level: 38, battery: '11.8V', ping: '45ms', status: 'Impassable', lat: 14.858024, lng: 120.815839 },
    4: { id: 4, name: 'Gate 4', location: 'Back Service', level: 5, battery: '12.5V', ping: '20ms', status: 'Safe', lat: 14.859670, lng: 120.814367 },
};

export function useTelemetry() {
    const [gateData, setGateData] = useState(BASE_GATE_DATA);

    useEffect(() => {
        console.log("🔌 Telemetry Hook Mounting: Connecting to Supabase...");

        // 1. FETCH INITIAL STATE (Get the latest recorded row for each gate on page load)
        const fetchInitialData = async () => {
            const { data, error } = await supabase
                .from('gate_telemetry')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20); // Pull recent history to find the latest state for each gate

            if (error) {
                console.error('❌ Supabase Fetch Error:', error);
                return;
            }

            if (data && data.length > 0) {
                console.log('✅ Initial Data Fetched from Supabase:', data);

                setGateData(prevData => {
                    const updatedData = { ...prevData };
                    // We iterate backwards so the newest rows overwrite the older rows
                    [...data].reverse().forEach(row => {
                        if (updatedData[row.gate_id]) {
                            updatedData[row.gate_id] = {
                                ...updatedData[row.gate_id],
                                level: row.water_level_cm,
                                battery: `${row.battery_voltage}V`,
                                status: row.status
                            };
                        }
                    });
                    return updatedData;
                });
            }
        };

        fetchInitialData();

        // 2. SUBSCRIBE TO LIVE WEBSOCKETS (Listen for new INSERTs in real-time)
        const subscription = supabase
            .channel('live-telemetry')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'gate_telemetry' },
                (payload) => {
                    const newRow = payload.new;
                    console.log('🚀 WEBSOCKET ALERT! New data arrived:', newRow);

                    // Update the specific gate with the new data
                    setGateData(prevData => ({
                        ...prevData,
                        [newRow.gate_id]: {
                            ...prevData[newRow.gate_id],
                            level: newRow.water_level_cm,
                            battery: `${newRow.battery_voltage}V`,
                            status: newRow.status
                        }
                    }));
                }
            )
            .subscribe((status) => {
                console.log("📡 Supabase Subscription Status:", status);
            });

        // 3. CLEANUP ON UNMOUNT
        return () => {
            console.log("🔌 Telemetry Hook Unmounting: Cleaning up connection.");
            supabase.removeChannel(subscription);
        };
    }, []);

    return { gateData, setGateData };
}