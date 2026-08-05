import React, { useState } from 'react';
import { X } from 'lucide-react';

// === IMPORT LAYOUT COMPONENTS ===
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MapWidget from './components/MapWidget';
import GateControlPanel from './components/GateControlPanel';
import GateDetails from './components/GateDetails';
import NodesPage from './components/NodesPage';
import BuildingSelector from './components/BuildingSelector';
import CompactVehicleSelector from './components/CompactVehicleSelector';

// === IMPORT CONTEXT & HOOKS ===
import { ThemeProvider } from './components/ThemeContext';
import { NotificationProvider } from './components/NotificationContext';
import NotificationDrawer from './components/NotificationDrawer';
import { useTelemetry } from './hooks/useTelemetry';
import { getBestExit } from './utils/exitCalculator';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // === NEW SMART ROUTING STATES ===
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);

  const { gateData } = useTelemetry();

  // === CALCULATE BEST EXIT GLOBALLY ===
  const bestExit = getBestExit(gateData, selectedVehicle, selectedBuilding);

  const handleGateClick = (gateId) => {
    setSelectedGate(prev => prev === gateId ? null : gateId);
  };

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

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">

              {activeView === 'dashboard' && (
                <div className="max-w-7xl mx-auto h-auto lg:h-full flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 animate-in fade-in duration-300 pb-24 lg:pb-0">

                  {/* LEFT COLUMN: Map Widget */}
                  {/* FIX: Removed flex-1 and added an explicit height of h-[500px] for mobile */}
                  <div className="w-full shrink-0 lg:col-span-8 h-[500px] lg:h-full relative z-0 flex flex-col">
                    <MapWidget
                      gateData={gateData}
                      selectedGate={selectedGate}
                      handleGateClick={handleGateClick}
                      bestExit={bestExit}
                      selectedBuilding={selectedBuilding}
                      selectedVehicle={selectedVehicle}
                    />
                  </div>

                  {/* RIGHT PANEL: Stacks under map on mobile, right column on desktop */}
                  <div className="flex w-full shrink-0 lg:col-span-4 flex-col gap-4">

                    {/* 1. Standalone Building Selector */}
                    <BuildingSelector
                      selectedBuilding={selectedBuilding}
                      setSelectedBuilding={setSelectedBuilding}
                    />

                    {/* 2. Compact Vehicle Selector for Global Exit Routing */}
                    <CompactVehicleSelector
                      selectedVehicle={selectedVehicle}
                      setSelectedVehicle={setSelectedVehicle}
                    />

                    {/* 3. DYNAMIC PANEL (Desktop Only) */}
                    <div className="hidden lg:block relative w-full h-[370px]">
                      {gateData && selectedGate && gateData[selectedGate] ? (
                        <div className="absolute inset-0 animate-in fade-in slide-in-from-right-4 duration-300">
                          <GateDetails
                            currentGate={gateData[selectedGate]}
                            selectedVehicle={selectedVehicle}
                            setSelectedVehicle={setSelectedVehicle}
                            onBack={() => setSelectedGate(null)}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 animate-in fade-in slide-in-from-left-4 duration-300">
                          <GateControlPanel
                            gateData={gateData}
                            selectedGate={selectedGate}
                            handleGateClick={handleGateClick}
                            bestExit={bestExit}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MOBILE BOTTOM SHEET (Sliding up over the screen) */}
                  <div
                    className={`lg:hidden fixed inset-x-0 bottom-0 z-[1000] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${selectedGate ? 'translate-y-0' : 'translate-y-full'
                      }`}
                  >
                    <div className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-slate-200/50 dark:border-slate-700/50 p-5 pb-8 max-h-[85vh] overflow-y-auto">
                      <div className="flex justify-center items-center mb-6 relative">
                        <div
                          className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full cursor-pointer"
                          onClick={() => setSelectedGate(null)}
                        />
                        <button
                          onClick={() => setSelectedGate(null)}
                          className="absolute right-0 p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors rounded-full text-slate-500 dark:text-slate-400"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {gateData && selectedGate && gateData[selectedGate] && (
                        <GateDetails
                          currentGate={gateData[selectedGate]}
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