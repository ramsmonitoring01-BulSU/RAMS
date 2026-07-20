import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Activity, Clock } from 'lucide-react';

export default function NodeHistoryChart({ gateId }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gateId) return;

        const fetchHistory = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('gate_telemetry')
                .select('created_at, water_level_cm')
                .eq('gate_id', gateId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error("Error fetching historical data:", error);
                setLoading(false);
                return;
            }

            if (data) {
                const formattedData = data.reverse().map(row => {
                    const date = new Date(row.created_at);
                    return {
                        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        fullDate: date.toLocaleString(),
                        level: row.water_level_cm
                    };
                });
                setChartData(formattedData);
            }
            setLoading(false);
        };

        fetchHistory();

        const subscription = supabase
            .channel(`chart-updates-gate-${gateId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'gate_telemetry', filter: `gate_id=eq.${gateId}` },
                (payload) => {
                    const date = new Date(payload.new.created_at);
                    const newPoint = {
                        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        fullDate: date.toLocaleString(),
                        level: payload.new.water_level_cm
                    };

                    setChartData(prev => [...prev, newPoint].slice(-50));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [gateId]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mb-1">{payload[0].payload.fullDate}</p>
                    <p className="text-sm font-display font-bold text-[#2563EB] dark:text-brand-light">
                        Depth: {payload[0].value} cm
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 w-full h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity size={18} className="text-[#2563EB]" />
                    Gate {gateId} History
                </h3>
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={14} /> Last 50 Readings
                </span>
            </div>

            <div className="flex-1 w-full min-h-0">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-sans text-sm">
                        Loading telemetry...
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-sans text-sm">
                        No historical data found.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                unit="cm"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="level"
                                stroke="#2563EB"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorLevel)"
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}