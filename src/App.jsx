import React, { useState } from 'react';
import { X } from 'lucide-react';

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
  const [activeView, setActiveView] = useState('dashboard');

  // === NEW SMART ROUTING STATES ===
  const [originGate, setOriginGate] = useState(null);
  const [destinationGate, setDestinationGate] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { gateData } = useTelemetry();

  // === TAP-TO-ROUTE TOGGLE LOGIC ===
  const handleGateClick = (gateId) => {
    // 1. Undo Origin Selection (If clicking the "From" gate again)
    if (originGate === gateId) {
      setOriginGate(destinationGate); // Shift destination to origin if one exists
      setDestinationGate(null);
      return;
    }
    // 2. Undo Destination Selection (If clicking the "To" gate again)
    if (destinationGate === gateId) {
      setDestinationGate(null);
      return;
    }
    // 3. Set Origin
    if (!originGate) {
      setOriginGate(gateId);
      return;
    }
    // 4. Set Destination
    if (!destinationGate) {
      setDestinationGate(gateId);
      return;
    }
    // 5. Reset Trip (If both are full and user clicks a brand new 3rd gate)
    setOriginGate(gateId);
    setDestinationGate(null);
  };

  // Decide which gate to show in the GateDetails panel (Prioritize showing destination, otherwise origin)
  const displayGateId = destinationGate || originGate;

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden font-sans">

          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isDesktopCollapsed={isDesktopCollapsed}
            setIsDesktopCollapsed={setIsDesktopCollapsed}
            activeView={activeView}
            setActiveView={setActiveView}
          />

          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <TopHeader setIsSidebarOpen={setIsSidebarOpen} gateData={gateData} />
            <NotificationDrawer />

            <main className="flex-1 overflow-y-auto p-0 md:p-6 lg:p-8 relative">

              {activeView === 'dashboard' && (
                <div className="max-w-7xl mx-auto h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-6 animate-in fade-in duration-300">

                  {/* LEFT COLUMN: Map Widget */}
                  <div className="flex-1 lg:col-span-8 min-h-[60vh] lg:min-h-0 relative z-0 flex flex-col gap-4">
                    <MapWidget
                      gateData={gateData}
                      originGate={originGate}
                      destinationGate={destinationGate}
                      handleGateClick={handleGateClick}
                      selectedVehicle={selectedVehicle}
                    />
                  </div>

                  {/* DESKTOP RIGHT PANEL */}
                  <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
                    <GateControlPanel
                      gateData={gateData}
                      originGate={originGate}
                      destinationGate={destinationGate}
                      handleGateClick={handleGateClick}
                    />

                    {gateData && displayGateId && gateData[displayGateId] && (
                      <GateDetails
                        currentGate={gateData[displayGateId]}
                        selectedVehicle={selectedVehicle}
                        setSelectedVehicle={setSelectedVehicle}
                      />
                    )}
                  </div>

                  {/* MOBILE BOTTOM SHEET */}
                  <div
                    className={`lg:hidden fixed inset-x-0 bottom-0 z-[1000] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${displayGateId ? 'translate-y-0' : 'translate-y-full'
                      }`}
                  >
                    <div className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-slate-200/50 dark:border-slate-700/50 p-5 pb-8 max-h-[85vh] overflow-y-auto">
                      <div className="flex justify-center items-center mb-6 relative">
                        <div
                          className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full cursor-pointer"
                          onClick={() => {
                            // Reset completely on close
                            handleGateClick(originGate);
                            if (destinationGate) handleGateClick(destinationGate);
                          }}
                        />
                        <button
                          onClick={() => {
                            setOriginGate(null);
                            setDestinationGate(null);
                          }}
                          className="absolute right-0 p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors rounded-full text-slate-500 dark:text-slate-400"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {gateData && displayGateId && gateData[displayGateId] && (
                        <GateDetails
                          currentGate={gateData[displayGateId]}
                          selectedVehicle={selectedVehicle}
                          setSelectedVehicle={setSelectedVehicle}
                        />
                      )}
                    </div>
                  </div>

                </div>
              )}

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