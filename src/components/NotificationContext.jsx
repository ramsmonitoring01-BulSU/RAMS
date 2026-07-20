import React, { createContext, useState, useContext, useEffect } from 'react';

// ============================================================================
// ⚠️ CALIBRATION & TESTING ZONE: WATER LEVEL THRESHOLDS 
// ============================================================================
// Adjust these values based on your physical testing. 
// These values represent the MAXIMUM water depth (in cm) before a vehicle 
// type is considered "submerged" or the route becomes "Impassable".
// ============================================================================
export const WATER_THRESHOLDS = {
    // Mode of Transportation Limits (in cm)
    HUMAN: 15,       // Max depth for a person walking
    E_TRIKE: 20,     // Max depth before E-Trike battery/motor shorts out
    TRIKE: 25,       // Max depth for standard tricycle exhaust
    MOTORBIKE: 35,   // Max depth for standard motorcycle
    SEDAN: 45,       // Max depth for standard 4-door car

    // General Node Warning Levels (in cm)
    WARNING_LEVEL: 15,    // Triggers "Yellow/Warning" status (e.g., ankle-deep)
    CRITICAL_LEVEL: 30,   // Triggers "Red/Impassable" status (e.g., knee-deep)
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // We are pre-loading some dummy notifications here so you can see the UI immediately.
    // Later, your IoT database will push live data into this array.
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            gateId: 2,
            type: 'warning',
            title: 'Gate 2 Water Level Rising',
            message: `Water level reached 18cm. Approaching E-Trike limit (${WATER_THRESHOLDS.E_TRIKE}cm).`,
            time: '2 mins ago',
            isRead: false
        },
        {
            id: 2,
            gateId: 3,
            type: 'critical',
            title: 'Gate 3 Impassable',
            message: `Water level at 38cm! Exceeds Motorbike limit (${WATER_THRESHOLDS.MOTORBIKE}cm). Avoid route.`,
            time: '15 mins ago',
            isRead: false
        }
    ]);

    // ========================================================================
    // THE GARBAGE COLLECTOR: Automatically removes read notifications
    // ========================================================================
    useEffect(() => {
        // This runs a check in the background every 5 seconds
        const sweepInterval = setInterval(() => {
            setNotifications(prevNotes => {
                const now = Date.now();

                // When you deploy, change this to 10 minutes: (10 * 60 * 1000)
                const EXPIRATION_TIME = 10 * 60 * 1000;

                return prevNotes.filter(note => {
                    // Rule 1: Always keep unread notifications
                    if (!note.isRead) return true;

                    // Rule 2: If it IS read, check how much time has passed
                    const timeSinceRead = now - note.readAt;
                    return timeSinceRead < EXPIRATION_TIME;
                });
            });
        }, 5000); // Sweeps every 5 seconds

        return () => clearInterval(sweepInterval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
    const closeDrawer = () => setIsDrawerOpen(false);

    const markAllAsRead = () => {
        const now = Date.now();
        setNotifications(prevNotes =>
            prevNotes.map(n =>
                // If it's already read, leave it alone. 
                // If it's unread, mark it as read and attach the exact timestamp it was clicked.
                n.isRead ? n : { ...n, isRead: true, readAt: now }
            )
        );
    };

    return (
        <NotificationContext.Provider value={{
            isDrawerOpen,
            toggleDrawer,
            closeDrawer,
            notifications,
            unreadCount,
            markAllAsRead,
            WATER_THRESHOLDS
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);