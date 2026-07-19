import React, { useState } from 'react';

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
    <div className="bg-[#F4F6F9] font-sans text-[#1E293B] antialiased flex h-screen overflow-hidden selection:bg-blue-200">

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
  );
}