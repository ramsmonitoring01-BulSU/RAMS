import React, { useState } from 'react';
import { X } from 'lucide-react'; // 1. Imported X icon for the mobile close button

// === IMPORT LAYOUT COMPONENTS ===
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MapWidget from './components/MapWidget';
import GateControlPanel from './components/GateControlPanel';
import GateDetails from './components/GateDetails';
import NodesPage from './components/NodesPage';

// === IMPORT CONTEXT & HOOKS ===
import { ThemeProvider } from './components/ThemeContext';
import { NotificationProvider } from './components/NotificationContext';
import NotificationDrawer from './components/NotificationDrawer';
import { useTelemetry } from './hooks/useTelemetry';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // 2. Changed default to `null` so the mobile map is completely unobstructed on initial load
  const [activeGate, setActiveGate] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const { gateData } = useTelemetry();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden font-sans">

          {/* LEFT NAVIGATION */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isDesktopCollapsed={isDesktopCollapsed}
            setIsDesktopCollapsed={setIsDesktopCollapsed}
            activeView={activeView}
            setActiveView={setActiveView}
          />

          {/* MAIN WORKSPACE */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <TopHeader setIsSidebarOpen={setIsSidebarOpen} gateData={gateData} />
            <NotificationDrawer />

            <main className="flex-1 overflow-y-auto p-0 md:p-6 lg:p-8 relative">
              {/* Note: Removed base padding on mobile (p-0) so the map touches the screen edges */}

              {/* === VIEW 1: MAIN DASHBOARD === */}
              {activeView === 'dashboard' && (
                <div className="max-w-7xl mx-auto h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-6 animate-in fade-in duration-300">

                  {/* 3. MAP WIDGET: Flexes to fill the screen on mobile, spans 8 columns on desktop */}
                  <div className="flex-1 lg:col-span-8 min-h-[60vh] lg:min-h-0 relative z-0">
                    <MapWidget
                      gateData={gateData}
                      activeGate={activeGate}
                      setActiveGate={setActiveGate}
                    />
                  </div>

                  {/* 4. DESKTOP RIGHT PANEL: Strictly hidden on mobile screens (hidden lg:flex) */}
                  <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
                    <GateControlPanel
                      gateData={gateData}
                      activeGate={activeGate}
                      setActiveGate={setActiveGate}
                    />
                    {gateData && activeGate && gateData[activeGate] && (
                      <GateDetails currentGate={gateData[activeGate]} />
                    )}
                  </div>

                  {/* 5. MOBILE BOTTOM SHEET: Strictly hidden on desktop (lg:hidden) */}
                  <div
                    className={`lg:hidden fixed inset-x-0 bottom-0 z-[1000] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeGate ? 'translate-y-0' : 'translate-y-full'
                      }`}
                  >
                    {/* Sheet Container & Glassmorphism Backdrop */}
                    <div className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-slate-200/50 dark:border-slate-700/50 p-5 pb-8 max-h-[85vh] overflow-y-auto">

                      {/* Swipe Handle & Close Button */}
                      <div className="flex justify-center items-center mb-6 relative">
                        {/* Visual drag handle to signify swiping */}
                        <div
                          className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full cursor-pointer"
                          onClick={() => setActiveGate(null)}
                        />
                        {/* Absolute positioned close icon for rapid dismissal */}
                        <button
                          onClick={() => setActiveGate(null)}
                          className="absolute right-0 p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors rounded-full text-slate-500 dark:text-slate-400"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Content Injection */}
                      {gateData && activeGate && gateData[activeGate] && (
                        <GateDetails currentGate={gateData[activeGate]} />
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* === VIEW 2: NODES & ANALYTICS === */}
              {activeView === 'nodes' && (
                <div className="max-w-7xl mx-auto h-full p-4 md:p-0 animate-in fade-in duration-300">
                  <NodesPage />
                </div>
              )}

            </main>
          </div>
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
}