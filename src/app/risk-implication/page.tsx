"use client";

import { useState, useCallback, useMemo } from "react";
import { fetchSST } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import MiniSparkline from "@/components/MiniSparkline";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { stressScenarios, stressTestResults } from "@/data/mockData";

function getRiskColor(risk: string): string {
    if (!risk) return "#8B949E";
    if (risk.includes("CRITICAL") || risk.includes("Crisis")) return "#EF4444";
    if (risk.includes("HIGH") || risk.includes("Inflation")) return "#F59E0B";
    if (risk.includes("MEDIUM") || risk.includes("Precarious")) return "#EAB308";
    if (risk.includes("LOW") || risk.includes("Neutral")) return "#39FF14";
    return "#8B949E";
}

function getSeverityLabel(severity: number): "Low" | "Moderate" | "Severe" | "Extreme" {
    if (severity < 40) return "Low";
    if (severity < 70) return "Moderate";
    if (severity < 90) return "Severe";
    return "Extreme";
}

export default function RiskImplicationPage() {
    const sstFetcher = useCallback(() => fetchSST(), []);

    const {
        data: sstLive,
        isLive: isSstLive,
        isLoading,
        lastUpdated,
        error,
        refresh,
    } = usePolling<any>({
        fetcher: sstFetcher,
        interval: 60_000,
    });

    const hasLiveSST = useMemo(() => {
        return (
            isSstLive &&
            sstLive &&
            sstLive.status !== "SST output not available yet" &&
            typeof sstLive === "object" &&
            Object.keys(sstLive).length > 0 &&
            sstLive.regime_output
        );
    }, [sstLive, isSstLive]);

    // UI state for Mock executions
    const [selectedScenario, setSelectedScenario] = useState<string>("recession");
    const [severity, setSeverity] = useState<number>(50);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [mockResult, setMockResult] = useState<any>(null);

    const executeStressTest = () => {
        setIsExecuting(true);
        setTimeout(() => {
            const resultData = stressTestResults[selectedScenario];
            if (resultData) {
                // Adjust impact values based on selected severity relative to base severity
                const multiplier = severity / resultData.severity;
                const adjustedImpacts = resultData.impacts.map(impact => ({
                    ...impact,
                    change: impact.change * multiplier,
                    // Simple adjustment to sparkline for effect
                    sparkline: impact.sparkline.map(val => val + (impact.change * multiplier - impact.change) / 2)
                }));
                
                setMockResult({
                    ...resultData,
                    executedSeverity: severity,
                    impacts: adjustedImpacts
                });
            }
            setIsExecuting(false);
        }, 1200);
    };

    const formatLabel = (str: string) => str.replace(/_/g, " ").toUpperCase();
    
    // Outputs from Live SST Engine (if any)
    const regime = sstLive?.regime_output?.regime || "Unknown";
    const crossAsset = sstLive?.cross_asset_impact?.visualizer || [];
    const portfolioImpact = sstLive?.portfolio_impact || {};
    const scenarioLadder = sstLive?.scenario_ladder || {};

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-end border-b border-[#30363D] pb-5">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
                        RISK IMPLICATION
                    </h1>
                    <div className="flex items-center gap-3">
                        <p className="text-[#8B949E] text-[10px] font-mono uppercase tracking-[0.2em]">
                            Cross-Asset Impact Simulation // SST Engine v2.1
                        </p>
                        {hasLiveSST && (
                            <span 
                                className="px-4 py-1.5 rounded-md text-sm lg:text-base font-bold uppercase tracking-widest border-2 shadow-sm"
                                style={{
                                    color: getRiskColor(regime),
                                    backgroundColor: `${getRiskColor(regime)}15`,
                                    borderColor: `${getRiskColor(regime)}60`
                                }}
                            >
                                REGIME: {formatLabel(regime)}
                            </span>
                        )}
                    </div>
                </div>
                <LiveStatusBadge
                    isLive={isSstLive}
                    isLoading={isLoading}
                    lastUpdated={lastUpdated}
                    error={error}
                    onRefresh={refresh}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LIVE CROSS ASSET IMPACT */}
                <div className="card p-5 space-y-4">
                    <h2 className="section-header">
                        <span className="text-[#39FF14] mr-2">📊</span> Cross-Asset Impact
                    </h2>
                    
                    {/* Graphical Impact Map */}
                    {crossAsset.length > 0 && (
                        <div className="h-48 w-full bg-[#0E1117] rounded-lg border border-[#30363D] p-2 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={crossAsset}
                                    layout="vertical"
                                    margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                                >
                                    <XAxis type="number" hide domain={[-3, 3]} />
                                    <YAxis 
                                        dataKey="factor" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: "#8B949E", fontSize: 10 }}
                                        tickFormatter={(val) => formatLabel(val)}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                        contentStyle={{ backgroundColor: "#161B22", border: "1px solid #30363D", borderRadius: "8px" }}
                                        formatter={(val: number) => [val.toFixed(2), "Shock"]}
                                    />
                                    <ReferenceLine x={0} stroke="#30363D" />
                                    <Bar dataKey="shock" radius={[0, 4, 4, 0]}>
                                        {crossAsset.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.shock >= 0 ? "#39FF14" : "#EF4444"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {crossAsset.map((asset: any) => (
                            <div key={asset.factor} className="bg-[#0E1117] p-3 rounded-lg border border-[#30363D]">
                                <div className="text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">{formatLabel(asset.factor)}</div>
                                <div className={`text-xl font-mono font-bold ${asset.shock >= 0 ? "text-[#39FF14]" : "text-[#EF4444]"}`}>
                                    {asset.shock > 0 ? "+" : ""}{asset.shock.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LIVE PORTFOLIO IMPACT */}
                <div className="card p-5 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="section-header">
                            <span className="text-[#39FF14] mr-2">💼</span> Portfolio Impact
                        </h2>
                        <span className={`text-lg font-mono font-bold ${portfolioImpact.total_portfolio_impact >= 0 ? "text-[#39FF14]" : "text-[#EF4444]"}`}>
                            {portfolioImpact.total_portfolio_impact > 0 ? "+" : ""}{portfolioImpact.total_portfolio_impact?.toFixed(2) || "0.00"}%
                        </span>
                    </div>
                    <div className="space-y-2">
                        {portfolioImpact.visualizer?.map((p: any) => (
                            <div key={p.ticker} className="flex justify-between items-center bg-[#0E1117] p-3 rounded-lg border border-[#30363D]">
                                <div className="flex flex-col">
                                    <span className="text-white font-semibold text-sm">{p.ticker}</span>
                                    <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">{formatLabel(p.factor)}</span>
                                </div>
                                <span className={`font-mono font-bold ${p.impact >= 0 ? "text-[#39FF14]" : "text-[#EF4444]"}`}>
                                    {p.impact > 0 ? "+" : ""}{p.impact.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LIVE SCENARIO LADDER */}
                <div className="card p-5 md:col-span-2 space-y-4">
                    <h2 className="section-header">
                        <span className="text-[#39FF14] mr-2">📈</span> Scenario Ladder
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[#30363D] text-[#8B949E] text-[10px] uppercase tracking-wider hidden md:table-row">
                                    <th className="pb-3 px-2">Factor</th>
                                    <th className="pb-3 px-2 text-right">Baseline Shock</th>
                                    <th className="pb-3 px-2 text-right">Moderate Shock</th>
                                    <th className="pb-3 px-2 text-right">Severe Shock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["Rates", "Equities", "Credit_Spreads", "USD", "Oil", "Volatility"].map((factor, i) => (
                                    <tr key={factor} className="border-b border-[#30363D]/50 hover:bg-[#161B22] flex flex-col md:table-row py-3 md:py-0">
                                        <td className="py-3 px-2 font-semibold text-white mb-2 md:mb-0">
                                            {formatLabel(factor)}
                                        </td>
                                        <td className="py-1 md:py-3 px-2 text-right">
                                            <span className="md:hidden text-[#8B949E] text-[10px] uppercase mr-2">Baseline:</span>
                                            <span className={`font-mono ${scenarioLadder.baseline?.[i] >= 0 ? "text-[#39FF14]" : "text-[#EF4444]"}`}>
                                                {scenarioLadder.baseline?.[i] > 0 ? "+" : ""}{scenarioLadder.baseline?.[i]?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-1 md:py-3 px-2 text-right">
                                            <span className="md:hidden text-[#8B949E] text-[10px] uppercase mr-2">Moderate:</span>
                                            <span className={`font-mono ${scenarioLadder.moderate?.[i] >= 0 ? "text-[#39FF14]" : "text-[#EF4444]"}`}>
                                                {scenarioLadder.moderate?.[i] > 0 ? "+" : ""}{scenarioLadder.moderate?.[i]?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-1 md:py-3 px-2 text-right">
                                            <span className="md:hidden text-[#8B949E] text-[10px] uppercase mr-2">Severe:</span>
                                            <span className={`font-mono ${scenarioLadder.severe?.[i] >= 0 ? "text-[#39FF14]" : "text-[#EF4444]"}`}>
                                                {scenarioLadder.severe?.[i] > 0 ? "+" : ""}{scenarioLadder.severe?.[i]?.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
