"use client";

import { useMemo, useState, useCallback } from "react";
import {
  kpiCards,
  cpiFedData,
  gdpGrowthData,
  newsData as mockNewsData,
  fedSpeakers,
  dataSources,
  dashboardData as mockDashboardData,
} from "@/data/mockData";
import {
  fetchDashboard,
  fetchArticles,
  fetchBriefing,
  transformArticlesToNews,
  transformHeatmapToKpis,
  transformAlertsToEvents,
  BackendDashboardResponse,
  BackendArticle,
} from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import MiniSparkline from "@/components/MiniSparkline";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  Line,
  ComposedChart,
} from "recharts";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("12M");

  // ─── Live data polling ───────────────────────────────────
  const dashboardFetcher = useCallback(() => fetchDashboard(), []);
  const articlesFetcher = useCallback(() => fetchArticles(), []);
  const briefingFetcher = useCallback(() => fetchBriefing(), []);

  const {
    data: dashboardLive,
    isLive: isDashLive,
    isLoading: isDashLoading,
    lastUpdated,
    error: dashError,
    refresh: refreshDash,
  } = usePolling<BackendDashboardResponse>({
    fetcher: dashboardFetcher,
    interval: 30_000,
  });

  const {
    data: articlesLive,
    isLive: isArticlesLive,
  } = usePolling<{ articles: BackendArticle[] }>({
    fetcher: articlesFetcher,
    interval: 30_000,
  });

  const {
    data: briefingLive,
    isLive: isBriefingLive,
  } = usePolling<{ briefing: string }>({
    fetcher: briefingFetcher,
    interval: 60_000,
  });

  // ─── Derived data ───────────────────────────────────────
  const isLive = isDashLive || isArticlesLive;

  const heatmapKpis = useMemo(() => {
    if (dashboardLive?.heatmap) {
      return transformHeatmapToKpis(dashboardLive.heatmap);
    }
    return mockDashboardData.heatmap;
  }, [dashboardLive]);

  const newsItems = useMemo(() => {
    if (articlesLive?.articles) {
      return transformArticlesToNews(articlesLive.articles).slice(0, 5);
    }
    return mockNewsData.slice(0, 5);
  }, [articlesLive]);

  const events = useMemo(() => {
    if (dashboardLive?.alerts && dashboardLive.alerts.length > 0) {
      return transformAlertsToEvents(dashboardLive.alerts);
    }
    return mockDashboardData.events;
  }, [dashboardLive]);

  const briefingText = useMemo(() => {
    if (briefingLive?.briefing) return briefingLive.briefing;
    return mockDashboardData.briefing;
  }, [briefingLive]);

  const stressTest = useMemo(() => {
    if (dashboardLive?.sst && Object.keys(dashboardLive.sst).length > 0) {
      return dashboardLive.sst;
    }
    return mockDashboardData.stress_test;
  }, [dashboardLive]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-[#30363D] pb-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            HOME SCREEN
          </h1>
          <p className="text-[#8B949E] text-[10px] font-mono uppercase tracking-[0.2em] mt-1">
            Asset Manager Dashboard // Ver 4.2.1
          </p>
        </div>
        <LiveStatusBadge
          isLive={isLive}
          isLoading={isDashLoading}
          lastUpdated={lastUpdated}
          error={dashError}
          onRefresh={refreshDash}
        />
      </div>

      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.title}
            className="card p-4 flex flex-col justify-between min-h-[110px]"
          >
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#8B949E] font-medium truncate">
              {kpi.title}
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-xl font-bold text-white">{kpi.value}</div>
                <div
                  className={`text-xs font-mono font-semibold mt-0.5 ${kpi.changeDir === "up" ? "text-[#39FF14]" : "text-[#EF4444]"
                    }`}
                >
                  {kpi.change}
                </div>
              </div>
              <MiniSparkline
                data={kpi.sparkline}
                color={kpi.changeDir === "up" ? "#39FF14" : "#EF4444"}
                width={60}
                height={24}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-5">
        {/* CPI vs Fed Rate Chart — Large Focus */}
        <div className="col-span-12 lg:col-span-8 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-header">
                <span className="text-[#39FF14]">📈</span> CPI vs. Fed Rate
                Sentiment Trend
              </h2>
            </div>
            <div className="flex gap-1">
              {["12M", "YTD", "5Y"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${timeframe === tf
                      ? "bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30"
                      : "text-[#8B949E] hover:text-[#C9D1D9] border border-transparent"
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cpiFedData}>
                <defs>
                  <linearGradient id="cpiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#8B949E", fontSize: 10 }}
                  stroke="#30363D"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8B949E", fontSize: 10 }}
                  stroke="#30363D"
                  tickLine={false}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#C9D1D9",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#8B949E" }}
                />
                <Area
                  type="monotone"
                  dataKey="cpi"
                  name="CPI (Actual)"
                  stroke="#39FF14"
                  fill="url(#cpiGrad)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="fedRate"
                  name="Fed Rate (Target)"
                  stroke="#39FF14"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  dot={false}
                  strokeOpacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fed Speaker Sentiment — Right Panel */}
        <div className="col-span-12 lg:col-span-4 card p-5">
          <h2 className="section-header mb-4">
            <span className="text-[#39FF14]">🏛️</span> Fed Speaker Sentiment
          </h2>
          <div className="space-y-3">
            {fedSpeakers.slice(0, 6).map((speaker) => (
              <div key={speaker.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">
                    {speaker.name}
                  </div>
                  <div className="text-[10px] text-[#8B949E]">
                    {speaker.role}
                  </div>
                </div>
                <div className="w-24 flex items-center gap-2">
                  <div className="sentiment-bar flex-1">
                    <div
                      className="sentiment-bar-fill"
                      style={{
                        width: `${speaker.sentiment}%`,
                        background:
                          speaker.sentiment > 65
                            ? "#39FF14"
                            : speaker.sentiment < 45
                              ? "#EF4444"
                              : "#8B949E",
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#8B949E] w-8 text-right">
                    {speaker.sentiment}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GDP Growth Bar Chart */}
        <div className="col-span-12 lg:col-span-5 card p-5">
          <h2 className="section-header mb-4">
            <span className="text-[#39FF14]">🌍</span> Top 5 Global Economies
            — GDP Growth
          </h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gdpGrowthData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#30363D"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#8B949E", fontSize: 10 }}
                  stroke="#30363D"
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fill: "#C9D1D9", fontSize: 12 }}
                  stroke="#30363D"
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#C9D1D9",
                  }}
                  formatter={(value: number) => [`${value}%`, "GDP Growth"]}
                />
                <Bar dataKey="growth" radius={[0, 4, 4, 0]} barSize={20}>
                  {gdpGrowthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.growth >= 0 ? "#39FF14" : "#EF4444"}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* News Sentiment Feed — LIVE */}
        <div className="col-span-12 lg:col-span-4 card p-5">
          <h2 className="section-header mb-4">
            <span className="text-[#39FF14]">🤖</span> AI News Sentiment
            {isArticlesLive && (
              <span className="ml-2 text-[8px] text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-1.5 py-0.5 rounded">
                LIVE
              </span>
            )}
          </h2>
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="p-3 bg-[#0E1117] rounded-lg border border-[#30363D] hover:border-[#39FF14]/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${news.sentiment === "BULLISH"
                        ? "badge-bullish"
                        : news.sentiment === "BEARISH"
                          ? "badge-bearish"
                          : "badge-neutral"
                      }`}
                  >
                    {news.sentiment}
                  </span>
                  <span className="theme-tag text-[9px] py-0.5">
                    {news.theme}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white leading-tight">
                  {news.headline}
                </p>
                <p className="text-[10px] text-[#8B949E] mt-1">
                  {news.source} · {news.timeAgo}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Provenance */}
        <div className="col-span-12 lg:col-span-3 card p-5">
          <h2 className="section-header mb-4">
            <span className="text-[#39FF14]">🔗</span> Data Sources
          </h2>
          <div className="space-y-3">
            {dataSources.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#39FF14] transition-colors group"
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="shrink-0 opacity-50 group-hover:opacity-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <div>
                  <div className="text-xs font-medium">{source.name}</div>
                  <div className="text-[10px] opacity-60">{source.type}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Events Ticker — LIVE */}
        <div className="col-span-12 card p-4 flex items-center overflow-hidden">
          <div className="section-header mr-6 whitespace-nowrap shrink-0">
            {isDashLive && dashboardLive?.alerts && dashboardLive.alerts.length > 0
              ? "🚨 Live Alerts"
              : "Recent Events"}
          </div>
          <div className="flex gap-8 overflow-x-auto pb-1">
            {events.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="text-[#39FF14] font-mono text-xs">
                  {event.time}
                </span>
                <span className="text-sm font-semibold text-white">
                  {event.title}
                </span>
                <span
                  className={`px-2 py-0.5 text-[8px] rounded font-bold uppercase ${event.impact === "HIGH"
                      ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                      : "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                    }`}
                >
                  {event.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}