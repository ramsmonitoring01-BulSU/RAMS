import React, { createContext, useState, useContext, useEffect } from 'react';

// ========================================================================
// PWEDE I EDIT TO CHANGE THE THRESHOLD
// ========================================================================
export const WATER_THRESHOLDS = {
    HUMAN: 15,
    E_TRIKE: 20,
    TRIKE: 25,
    MOTORBIKE: 35,
    SEDAN: 45,
    WARNING_LEVEL: 15,
    CRITICAL_LEVEL: 30,
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const addNotification = (note) => {
        setNotifications(prev => {
            const isDuplicate = prev.some(n => !n.isRead && n.gateId === note.gateId && n.type === note.type);
            if (isDuplicate) return prev;

            const newNotification = {
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isRead: false,
                ...note
            };

            return [newNotification, ...prev];
        });
    };

    useEffect(() => {
        const sweepInterval = setInterval(() => {
            setNotifications(prevNotes => {
                const now = Date.now();
                const EXPIRATION_TIME = 10 * 60 * 1000;

                return prevNotes.filter(note => {
                    if (!note.isRead) return true;
                    const timeSinceRead = now - note.readAt;
                    return timeSinceRead < EXPIRATION_TIME;
                });
            });
        }, 5000);

        return () => clearInterval(sweepInterval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
    const closeDrawer = () => setIsDrawerOpen(false);

    // ========================================================================
    // Function to mark a SINGLE notification as read
    // ========================================================================
    const markAsRead = (id) => {
        const now = Date.now();
        setNotifications(prevNotes =>
            prevNotes.map(n =>
                n.id === id && !n.isRead ? { ...n, isRead: true, readAt: now } : n
            )
        );
    };

    // Existing function to mark ALL as read
    const markAllAsRead = () => {
        const now = Date.now();
        setNotifications(prevNotes =>
            prevNotes.map(n =>
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
            markAsRead, // <-- Export the new function here
            WATER_THRESHOLDS,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);