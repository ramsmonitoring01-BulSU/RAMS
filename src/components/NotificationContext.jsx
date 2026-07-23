import React, { createContext, useState, useContext, useEffect } from 'react';

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

    const [notifications, setNotifications] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedNotes = localStorage.getItem('rams_notifications');
            if (savedNotes) {
                try {
                    return JSON.parse(savedNotes);
                } catch (e) {
                    console.error("Failed to parse notifications", e);
                }
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('rams_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (note) => {
        setNotifications(prev => {
            // FIX: We removed "!n.isRead" so it blocks duplicates even if they are acknowledged 
            // and hiding in the background memory.
            const isDuplicate = prev.some(n => n.gateId === note.gateId && n.type === note.type);
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

    const markAsRead = (id) => {
        const now = Date.now();
        setNotifications(prevNotes =>
            prevNotes.map(n =>
                n.id === id && !n.isRead ? { ...n, isRead: true, readAt: now } : n
            )
        );
    };

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
            markAsRead,
            WATER_THRESHOLDS,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);