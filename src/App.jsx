import React, { useState } from 'react';

// === IMPORT LAYOUT COMPONENTS ===
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MapWidget from './components/MapWidget';
//import SummaryCards from './components/SummaryCards';
import GateControlPanel from './components/GateControlPanel';
import GateDetails from './components/GateDetails';

// === IMPORT CONTEXT & HOOKS ===
import { ThemeProvider } from './components/ThemeContext';
import { NotificationProvider } from './components/NotificationContext';
import NotificationDrawer from './components/NotificationDrawer';
import { useTelemetry } from './hooks/useTelemetry';

export default function App() {
  // UI Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Interactive State
  const [activeGate, setActiveGate] = useState(1);

  // Fetch data from our custom hook (currently mockData, soon to be Supabase WebSockets)
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
          />

          {/* MAIN WORKSPACE */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

            {/* TOP NAVIGATION & CONTROLS */}
            <TopHeader setIsSidebarOpen={setIsSidebarOpen} gateData={gateData} />

            {/* SLIDE-OUT NOTIFICATIONS */}
            <NotificationDrawer />

            {/* DASHBOARD GRID */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: 8 Columns for the Interactive Map */}
                <MapWidget
                  gateData={gateData}
                  activeGate={activeGate}
                  setActiveGate={setActiveGate}
                />

                {/* Right Side: 4 Columns for Metrics & Controls */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  

                  <GateControlPanel
                    gateData={gateData}
                    activeGate={activeGate}
                    setActiveGate={setActiveGate}
                  />

                  {/* Fallback to render GateDetails only if gateData is successfully loaded */}
                  {gateData && gateData[activeGate] && (
                    <GateDetails currentGate={gateData[activeGate]} />
                  )}
                </div>

              </div>
            </main>
          </div>

        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
}