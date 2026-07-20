import React from 'react';
import { X, CheckCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNotification } from './NotificationContext';

export default function NotificationDrawer() {
    const { isDrawerOpen, closeDrawer, notifications, markAllAsRead, unreadCount } = useNotification();

    return (
        <>
            {/* BACKDROP OVERLAY: Darkens the rest of the app when open */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={closeDrawer}
                ></div>
            )}

            {/* SLIDE-OUT DRAWER */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-card-dark border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>

                {/* DRAWER HEADER */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* DRAWER ACTIONS */}
                {unreadCount > 0 && (
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                        <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-[#2563EB] dark:text-brand-light hover:underline flex items-center gap-1.5"
                        >
                            <CheckCheck size={14} /> Mark all as read
                        </button>
                    </div>
                )}

                {/* NOTIFICATIONS LIST */}
                <div className="flex-1 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                        <div className="text-center text-slate-500 dark:text-slate-400 mt-10 text-sm font-medium">
                            No notifications right now.
                        </div>
                    ) : (
                        notifications.map(note => (
                            <div
                                key={note.id}
                                className={`p-4 mb-2 rounded-xl border-l-4 transition-colors ${note.isRead
                                        ? 'bg-transparent border-transparent opacity-60'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-rose-500 shadow-sm'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    {/* Icon logic based on severity */}
                                    <div className="mt-0.5 shrink-0">
                                        {note.type === 'critical'
                                            ? <AlertCircle size={18} className="text-rose-500" />
                                            : <AlertTriangle size={18} className="text-amber-500" />
                                        }
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold ${note.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                                {note.title}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2 whitespace-nowrap">
                                                {note.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                            {note.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </>
    );
}