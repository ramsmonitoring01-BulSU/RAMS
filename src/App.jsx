import React, { useState } from 'react';

// Import the Theme Provider
import { ThemeProvider } from './components/ThemeContext';

// Import all the separated components
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import SummaryCards from './components/SummaryCards';
import MapWidget from './components/MapWidget';
import GateControlPanel from './components/GateControlPanel';
import GateDetails from './components/GateDetails';

import { useGateTelemetry } from './hooks/useGateTelemetry';

// Import the central configuration data
import { gateData } from './data/mockData';

export default function App() {
  // Global State for the Dashboard
  const [activeGate, setActiveGate] = useState(2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // FETCH HARDWARE DATA VIA HOOK
  const { telemetry, isLive } = useGateTelemetry();

  return (
    // 1. Wrap the entire app in the ThemeProvider
    <ThemeProvider>
      {/* 2. Updated the root div with dark mode dynamic classes and transition */}
      <div className="bg-surface-light dark:bg-surface-dark font-sans text-slate-900 dark:text-white transition-colors duration-300 antialiased flex h-screen overflow-hidden selection:bg-brand-light">

        {/* SIDEBAR COMPONENT */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDesktopCollapsed={isDesktopCollapsed}
          setIsDesktopCollapsed={setIsDesktopCollapsed}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* TOP HEADER COMPONENT */}
          <TopHeader setIsSidebarOpen={setIsSidebarOpen} />

          {/* WORKSPACE CANVAS */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

            {/* Main Grid: Map on the left (8 cols), Controls on the right (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 min-h-[500px] h-full">

              {/* LEFT: Expanded Map View */}
              <MapWidget />

              {/* RIGHT: Master Control Column */}
              <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-6">

                <SummaryCards />

                <GateControlPanel
                  gateData={gateData}
                  activeGate={activeGate}
                  setActiveGate={setActiveGate}
                />

                <GateDetails
                  currentGate={gateData[activeGate]}
                />

              </div>

            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}