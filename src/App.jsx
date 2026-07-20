import React, { useState } from 'react';

// === IMPORT LAYOUT COMPONENTS ===
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MapWidget from './components/MapWidget';
import GateControlPanel from './components/GateControlPanel';
import GateDetails from './components/GateDetails';
import NodesPage from './components/NodesPage'; // 1. Added NodesPage Import

// === IMPORT CONTEXT & HOOKS ===
import { ThemeProvider } from './components/ThemeContext';
import { NotificationProvider } from './components/NotificationContext';
import NotificationDrawer from './components/NotificationDrawer';
import { useTelemetry } from './hooks/useTelemetry';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [activeGate, setActiveGate] = useState(1);

  // 2. Added routing state (defaults to 'dashboard')
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
            activeView={activeView}       // 3. Pass activeView to Sidebar
            setActiveView={setActiveView} // 4. Pass setActiveView to Sidebar
          />

          {/* MAIN WORKSPACE */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <TopHeader setIsSidebarOpen={setIsSidebarOpen} gateData={gateData} />
            <NotificationDrawer />

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

              {/* === VIEW 1: MAIN DASHBOARD === */}
              {activeView === 'dashboard' && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
                  <MapWidget
                    gateData={gateData}
                    activeGate={activeGate}
                    setActiveGate={setActiveGate}
                  />
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <GateControlPanel
                      gateData={gateData}
                      activeGate={activeGate}
                      setActiveGate={setActiveGate}
                    />
                    {gateData && gateData[activeGate] && (
                      <GateDetails currentGate={gateData[activeGate]} />
                    )}
                  </div>
                </div>
              )}

              {/* === VIEW 2: NODES & ANALYTICS === */}
              {activeView === 'nodes' && (
                <div className="max-w-7xl mx-auto h-full animate-in fade-in duration-300">
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