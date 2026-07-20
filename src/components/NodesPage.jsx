import React from 'react';
import NodeHistoryChart from './NodeHistoryChart';

export default function NodesPage() {
    return (
        <div className="flex flex-col h-full">

            <div className="mb-6">
                <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    Nodes & Analytics
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-sans text-sm mt-1">
                    Historical telemetry data and water level trends across all monitoring gates.
                </p>
            </div>

            {/* 2x2 Grid on large screens, 1 column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <NodeHistoryChart gateId={1} />
                <NodeHistoryChart gateId={2} />
                <NodeHistoryChart gateId={3} />
                <NodeHistoryChart gateId={4} />
            </div>

        </div>
    );
}