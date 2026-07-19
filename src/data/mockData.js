// ============================================================================
// RAMS DASHBOARD - CENTRAL DATA CONFIGURATION
// ============================================================================
// INSTRUCTIONS FOR NON-TECHNICAL USERS:
// You can safely edit the text inside the quotation marks (e.g., "Gate 1") 
// or the numbers (e.g., 12.4) to test how the dashboard looks with different data.
// Do NOT delete the commas or the curly brackets { }.
// ============================================================================

export const gateData = {
    1: {
        name: "Gate 1",
        location: "East Wing",
        level: 0.0,           // Number: The current water depth in cm
        status: "Passable",   // Text: Must be "Passable", "Warning", or "Impassable"
        battery: "4.1V",      // Text: The battery voltage reading
        ping: "2s ago"        // Text: When the sensor last sent data
    },
    2: {
        name: "Gate 2",
        location: "Main Entrance",
        level: 12.4,
        status: "Warning",
        battery: "3.8V",
        ping: "15s ago"
    },
    3: {
        name: "Gate 3",
        location: "West Wing",
        level: 2.1,
        status: "Passable",
        battery: "4.2V",
        ping: "5s ago"
    },
    4: {
        name: "Gate 4",
        location: "South Gate",
        level: 46.5,
        status: "Impassable",
        battery: "4.0V",
        ping: "1s ago"
    }
};