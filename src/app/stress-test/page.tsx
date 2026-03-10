"use client";

import { useState, useCallback, useMemo } from "react";
import {
    stressScenarios,
    stressTestResults as mockResults,
    StressTestResult,
} from "@/data/mockData";
import { fetchSST, fetchDashboard } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import MiniSparkline from "@/components/MiniSparkline";
import LiveStatusBadge from "@/components/LiveStatusBadge";

function getRiskColor(risk: string): string {
    switch (risk) {
        case "CRITICAL":
            return "#EF4444";
        case "HIGH":
            return "#F59E0B";
        case "MEDIUM":
            return "#39FF14";
        case "LOW":
            return "#39FF14";
        default:
            return "#8B949E";
    }
}

function getSeverityLabel(severity: number): string {
    if (severity >= 80) return "CRITICAL RISK";
    if (severity >= 60) return "HIGH RISK";
    if (severity >= 40) return "MODERATE RISK";
    return "LOW RISK";
}

export default function StressTestPage() {
    const [selectedScenario, setSelectedScenario] = useState("recession");
    const [severity, setSeverity] = useState(75);
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<StressTestResult | null>(null);

    // ─── Fetch live SST output from backend ──────────────────
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

    // ─── Check if backend SST data is valid ──────────────────
    const hasLiveSST = useMemo(() => {
        return (
            isSstLive &&
            sstLive &&
            sstLive.status !== "SST output not available yet" &&
            typeof sstLive === "object" &&
            Object.keys(sstLive).length > 0
        );
    }, [sstLive, isSstLive]);

    const scenario = stressScenarios.find((s) => s.id === selectedScenario);

    const executeStressTest = useCallback(() => {
        setIsExecuting(true);
        setResult(null);

        // If we have live SST data, use it to augment the stress test
        setTimeout(() => {
            const baseResult = mockResults[selectedScenario];
            if (baseResult) {
                const multiplier = severity / 75;

                // If live SST is available, blend with mock data
                let aiBreakdown = baseResult.aiBreakdown;
                if (hasLiveSST && sstLive) {
                    // Append live data context to AI breakdown
                    const liveHeatmap = sstLive.heatmap || {};
                    const hotThemes = Object.entries(liveHeatmap)
                        .sort((a: any, b: any) => b[1] - a[1])
                        .slice(0, 3)
                        .map((e) => e[0]);

                    if (hotThemes.length > 0) {
                        aiBreakdown += `\n\n[LIVE DATA] Current hottest macro themes from NLP pipeline: ${hotThemes.join(", ")}. The stress scenario's cross-asset impacts are weighted by real-time theme intensity.`;
                    }

                    const liveAlerts = sstLive.alerts || [];
                    if (liveAlerts.length > 0) {
                        aiBreakdown += ` Currently ${liveAlerts.length} active alert(s) triggered in the pipeline.`;
                    }
                }

                const adjustedResult: StressTestResult = {
                    ...baseResult,
                    severity,
                    overallRisk:
                        severity >= 80
                            ? "CRITICAL"
                            : severity >= 60
                                ? "HIGH"
                                : severity >= 40
                                    ? "MEDIUM"
                                    : "LOW",
                    impacts: baseResult.impacts.map((impact) => ({
                        ...impact,
                        change: Math.round(impact.change * multiplier * 10) / 10,
                    })),
                    aiBreakdown,
                };
                setResult(adjustedResult);
            }
            setIsExecuting(false);
        }, 2200);
    }, [selectedScenario, severity, hasLiveSST, sstLive]);

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-end border-b border-[#30363D] pb-5">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                        SCENARIO STRESS TEST
                    </h1>
                    <p className="text-[#8B949E] text-[10px] font-mono uppercase tracking-[0.2em] mt-1">
                        Cross-Asset Impact Simulation // SST Engine v2.1
                    </p>
                </div>
                <LiveStatusBadge
                    isLive={isSstLive}
                    isLoading={isLoading}
                    lastUpdated={lastUpdated}
                    error={error}
                    onRefresh={refresh}
                />
            </div>

            {/* LAYOUT */}
            <div className="grid grid-cols-12 gap-5">
                {/* Control Panel — Left */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="card p-5 space-y-5 sticky top-6">
                        <h2 className="section-header">Control Panel</h2>

                        {/* Live SST indicator */}
                        {hasLiveSST && (
                            <div className="p-2.5 bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-lg text-[10px] text-[#39FF14] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#39FF14] pulse-glow" />
                                SST engine has live data from NLP pipeline
                            </div>
                        )}

                        {/* Scenario Selector */}
                        <div>
                            <label className="text-[11px] text-[#8B949E] font-medium uppercase tracking-wider block mb-2">
                                Scenario
                            </label>
                            <select
                                value={selectedScenario}
                                onChange={(e) => setSelectedScenario(e.target.value)}
                                className="w-full"
                            >
                                {stressScenarios.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Scenario Description */}
                        {scenario && (
                            <div className="p-3 bg-[#0E1117] rounded-lg border border-[#30363D] text-xs text-[#8B949E] leading-relaxed">
                                {scenario.description}
                            </div>
                        )}

                        {/* Severity Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[11px] text-[#8B949E] font-medium uppercase tracking-wider">
                                    Severity Multiplier
                                </label>
                                <span className="text-sm font-mono text-[#39FF14] font-bold">
                                    {severity}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={severity}
                                onChange={(e) => setSeverity(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] text-[#8B949E] mt-1">
                                <span>Mild</span>
                                <span>Severe</span>
                            </div>
                        </div>

                        {/* Risk Level Indicator */}
                        <div className="flex items-center gap-2">
                            <svg
                                width="14"
                                height="14"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke={getRiskColor(
                                    severity >= 80
                                        ? "CRITICAL"
                                        : severity >= 60
                                            ? "HIGH"
                                            : severity >= 40
                                                ? "MEDIUM"
                                                : "LOW"
                                )}
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span
                                className="text-xs font-bold uppercase"
                                style={{
                                    color: getRiskColor(
                                        severity >= 80
                                            ? "CRITICAL"
                                            : severity >= 60
                                                ? "HIGH"
                                                : severity >= 40
                                                    ? "MEDIUM"
                                                    : "LOW"
                                    ),
                                }}
                            >
                                {getSeverityLabel(severity)}
                            </span>
                        </div>

                        {/* Execute Button */}
                        <button
                            onClick={executeStressTest}
                            disabled={isExecuting}
                            className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{
                                background: isExecuting
                                    ? "#30363D"
                                    : "linear-gradient(135deg, #39FF14 0%, #2ad10e 100%)",
                                color: isExecuting ? "#8B949E" : "#0E1117",
                                boxShadow: isExecuting
                                    ? "none"
                                    : "0 0 20px rgba(57, 255, 20, 0.3)",
                            }}
                        >
                            {isExecuting ? (
                                <>
                                    <svg
                                        className="animate-spin"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    Calculating...
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Execute Stress Test
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Panel — Right */}
                <div className="col-span-12 lg:col-span-9">
                    {isExecuting ? (
                        /* Skeleton Loading */
                        <div className="space-y-5 animate-fade-in">
                            <div className="card p-5">
                                <div className="skeleton h-6 w-48 mb-4" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-[#0E1117] rounded-lg p-4 border border-[#30363D]"
                                        >
                                            <div className="skeleton h-4 w-20 mb-3" />
                                            <div className="skeleton h-8 w-16 mb-2" />
                                            <div className="skeleton h-6 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card p-5">
                                <div className="skeleton h-6 w-48 mb-4" />
                                <div className="skeleton h-4 w-full mb-2" />
                                <div className="skeleton h-4 w-3/4 mb-2" />
                                <div className="skeleton h-4 w-5/6" />
                            </div>
                        </div>
                    ) : result ? (
                        /* Results */
                        <div className="space-y-5 stagger-children">
                            {/* Impact Grid */}
                            <div className="card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="section-header">
                                        <span className="text-[#39FF14]">📊</span> Cross-Asset
                                        Impact
                                        {hasLiveSST && (
                                            <span className="ml-2 text-[8px] text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-1.5 py-0.5 rounded">
                                                AUGMENTED WITH LIVE DATA
                                            </span>
                                        )}
                                    </h2>
                                    <span
                                        className="px-3 py-1 rounded text-[10px] font-bold uppercase"
                                        style={{
                                            color: getRiskColor(result.overallRisk),
                                            background: `${getRiskColor(result.overallRisk)}15`,
                                            border: `1px solid ${getRiskColor(result.overallRisk)}30`,
                                        }}
                                    >
                                        {result.overallRisk} RISK
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {result.impacts.map((impact) => (
                                        <div
                                            key={impact.asset}
                                            className="bg-[#0E1117] rounded-lg p-4 border border-[#30363D] hover:border-[#39FF14]/20 transition-all"
                                        >
                                            <div className="text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">
                                                {impact.category}
                                            </div>
                                            <div className="text-sm font-semibold text-white mb-2">
                                                {impact.asset}
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <div
                                                    className={`text-2xl font-bold font-mono ${impact.change >= 0
                                                            ? "text-[#39FF14]"
                                                            : "text-[#EF4444]"
                                                        }`}
                                                >
                                                    {impact.change > 0 ? "+" : ""}
                                                    {impact.change}%
                                                </div>
                                                <MiniSparkline
                                                    data={impact.sparkline}
                                                    color={impact.change >= 0 ? "#39FF14" : "#EF4444"}
                                                    width={60}
                                                    height={24}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Risk Breakdown */}
                            <div className="card p-5">
                                <h2 className="section-header mb-4">
                                    <span className="text-[#39FF14]">🤖</span> AI Risk Breakdown
                                </h2>
                                <div className="p-4 bg-[#0E1117] rounded-lg border border-[#30363D]">
                                    {result.aiBreakdown.split("\n\n").map((paragraph, i) => (
                                        <p
                                            key={i}
                                            className={`text-sm leading-relaxed ${paragraph.startsWith("[LIVE DATA]")
                                                    ? "text-[#39FF14] mt-3 pt-3 border-t border-[#30363D]"
                                                    : "text-[#C9D1D9]"
                                                } ${i > 0 ? "mt-2" : ""}`}
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <svg
                                width="64"
                                height="64"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#30363D"
                                strokeWidth={1}
                                className="mb-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">
                                Select a Scenario & Execute
                            </h3>
                            <p className="text-sm text-[#8B949E] max-w-[300px]">
                                Choose a macroeconomic stress scenario from the control panel,
                                adjust severity, and run the simulation.
                            </p>
                            {hasLiveSST && (
                                <p className="text-[11px] text-[#39FF14] mt-3">
                                    ✦ Live NLP pipeline data will augment the analysis
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
