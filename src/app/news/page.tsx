"use client";

import { useState, useMemo, useCallback } from "react";
import { newsData as mockNewsData, themeFrequencyData as mockThemeFreq } from "@/data/mockData";

const formatLabel = (str: string) => str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
import {
    fetchArticles,
    transformArticlesToNews,
    transformHeatmapToFrequency,
    fetchHeatmap,
    BackendArticle,
} from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import LiveStatusBadge from "@/components/LiveStatusBadge";

const allThemes = [
    "Inflation Shock",
    "Dollar Strength",
    "Rate Pivot",
    "Geopolitical Risk",
    "Energy Crisis",
    "Labor Market",
    "China Slowdown",
    "Fiscal Expansion",
    "Growth Slowdown",
    "Recession Risk",
    "Monetary Tightening",
    "Monetary Easing",
    "Disinflation",
    "Energy Shock",
    "Banking Stress",
    "Credit Crunch",
    "Growth Reacceleration",
    "Risk Off",
    "Risk On",
    "Volatility Shock",
    "Geopolitical Escalation",
];

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeThemes, setActiveThemes] = useState<string[]>([]);
    const [sortByRelevance, setSortByRelevance] = useState(true);

    // ─── Live data polling ───────────────────────────────────
    const articlesFetcher = useCallback(() => fetchArticles(), []);
    const heatmapFetcher = useCallback(() => fetchHeatmap(), []);

    const {
        data: articlesLive,
        isLive,
        isLoading,
        lastUpdated,
        error,
        refresh,
    } = usePolling<{ articles: BackendArticle[] }>({
        fetcher: articlesFetcher,
        interval: 30_000,
    });

    const { data: heatmapLive, isLive: isHeatmapLive } = usePolling<{
        heatmap: Record<string, number>;
    }>({
        fetcher: heatmapFetcher,
        interval: 30_000,
    });

    // ─── Transform backend data ─────────────────────────────
    const allNews = useMemo(() => {
        if (articlesLive?.articles) {
            return transformArticlesToNews(articlesLive.articles);
        }
        return mockNewsData;
    }, [articlesLive]);

    const themeFrequency = useMemo(() => {
        if (heatmapLive?.heatmap) {
            return transformHeatmapToFrequency(heatmapLive.heatmap);
        }
        return mockThemeFreq;
    }, [heatmapLive]);

    // Compute available themes from live data
    const availableThemes = useMemo(() => {
        const themes = new Set(allNews.map((n) => n.theme));
        return allThemes.filter((t) => themes.has(t));
    }, [allNews]);

    const toggleTheme = (theme: string) => {
        setActiveThemes((prev) =>
            prev.includes(theme)
                ? prev.filter((t) => t !== theme)
                : [...prev, theme]
        );
    };

    const filteredNews = useMemo(() => {
        let items = [...allNews];

        // Filter by search
        if (searchQuery) {
            items = items.filter(
                (n) =>
                    n.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by themes
        if (activeThemes.length > 0) {
            items = items.filter((n) => activeThemes.includes(n.theme));
        }

        // Sort
        if (sortByRelevance) {
            items.sort((a, b) => b.relevance - a.relevance);
        }

        return items;
    }, [searchQuery, activeThemes, sortByRelevance, allNews]);

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-end border-b border-[#30363D] pb-5">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                        AI NEWS SUMMARIZER
                    </h1>
                    <p className="text-[#8B949E] text-[10px] font-mono uppercase tracking-[0.2em] mt-1">
                        Theme Detection & Sentiment // Real-Time Feed
                    </p>
                </div>
                <LiveStatusBadge
                    isLive={isLive}
                    isLoading={isLoading}
                    lastUpdated={lastUpdated}
                    error={error}
                    onRefresh={refresh}
                />
            </div>

            {/* SEARCH & FILTERS */}
            <div className="card p-4 space-y-3">
                <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#8B949E"
                            strokeWidth={2}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search headlines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0E1117] border border-[#30363D] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:border-[#39FF14] transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setSortByRelevance(!sortByRelevance)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${sortByRelevance
                            ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                            : "bg-[#161B22] text-[#8B949E] border border-[#30363D] hover:text-[#C9D1D9]"
                            }`}
                    >
                        <svg
                            width="14"
                            height="14"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                            />
                        </svg>
                        By Relevance
                    </button>
                </div>

                {/* Theme filter tags */}
                <div className="flex flex-wrap gap-2">
                    {availableThemes.map((theme) => (
                        <button
                            key={theme}
                            onClick={() => toggleTheme(theme)}
                            className={`theme-tag ${activeThemes.includes(theme) ? "active" : ""
                                }`}
                        >
                            {formatLabel(theme)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Article count */}
            <div className="text-[11px] text-[#8B949E] font-mono">
                Showing {filteredNews.length} of {allNews.length} articles
                {isLive && (
                    <span className="text-[#39FF14] ml-2">· Live from NLP pipeline</span>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-12 gap-5">
                {/* News Feed — Left 70% */}
                <div className="col-span-12 lg:col-span-8 space-y-3 stagger-children">
                    {isLoading ? (
                        // Skeleton loading
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="card p-5">
                                <div className="flex gap-2 mb-3">
                                    <div className="skeleton h-5 w-16" />
                                    <div className="skeleton h-5 w-24" />
                                </div>
                                <div className="skeleton h-5 w-3/4 mb-2" />
                                <div className="skeleton h-4 w-full mb-2" />
                                <div className="skeleton h-3 w-1/3" />
                            </div>
                        ))
                    ) : filteredNews.length === 0 ? (
                        <div className="card p-8 text-center">
                            <p className="text-[#8B949E] text-sm">
                                No articles match your filters.
                            </p>
                        </div>
                    ) : (
                        filteredNews.map((news) => (
                            <div
                                key={news.id}
                                className="card p-5 hover:border-[#39FF14]/20 transition-all group"
                            >
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${news.sentiment === "BULLISH"
                                            ? "badge-bullish"
                                            : news.sentiment === "BEARISH"
                                                ? "badge-bearish"
                                                : "badge-neutral"
                                            }`}
                                    >
                                        {news.sentiment}
                                    </span>
                                    <span className="theme-tag text-[10px]">{formatLabel(news.theme)}</span>
                                </div>

                                {/* Headline */}
                                {news.link ? (
                                    <a
                                        href={news.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white font-semibold text-[15px] mb-1.5 group-hover:text-[#39FF14] transition-colors flex items-center gap-2 hover:underline"
                                    >
                                        {news.headline}
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0 opacity-40 group-hover:opacity-100">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ) : (
                                    <h3 className="text-white font-semibold text-[15px] mb-1.5 group-hover:text-[#39FF14] transition-colors">
                                        {news.headline}
                                    </h3>
                                )}

                                {/* Summary */}
                                <p className="text-[#8B949E] text-sm leading-relaxed mb-3">
                                    {news.summary}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[11px] text-[#8B949E]">
                                        <span className="font-semibold text-[#C9D1D9]">
                                            {news.source}
                                        </span>
                                        <span>·</span>
                                        <span>{news.timeAgo}</span>
                                        <span>·</span>
                                        <span>
                                            Relevance:{" "}
                                            <span className="text-[#39FF14] font-semibold">
                                                {news.relevance}%
                                            </span>
                                        </span>
                                    </div>
                                    {news.link && (
                                        <a
                                            href={news.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-[#8B949E] hover:text-[#39FF14] transition-colors flex items-center gap-1 font-medium"
                                        >
                                            Read Full Article
                                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar — Theme Frequency */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="card p-5 sticky top-6">
                        <h2 className="section-header mb-4">
                            <span className="text-[#39FF14]">📊</span> Theme Frequency
                            {isHeatmapLive ? (
                                <span className="ml-2 text-[8px] text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-1.5 py-0.5 rounded">
                                    LIVE
                                </span>
                            ) : (
                                <span className="ml-1 text-[#8B949E]">(Today)</span>
                            )}
                        </h2>
                        <div className="space-y-3">
                            {themeFrequency.map((item, index) => (
                                <div key={item.theme} className="flex items-center gap-3">
                                    <span className="text-xs text-[#8B949E] w-28 truncate text-right">
                                        {formatLabel(item.theme)}
                                    </span>
                                    <div className="flex-1 h-5 bg-[#0E1117] rounded overflow-hidden relative">
                                        <div
                                            className="h-full rounded animate-fade-in"
                                            style={{
                                                width: `${(item.count / Math.max(...themeFrequency.map((t) => t.count), 1)) * 100}%`,
                                                background: `linear-gradient(90deg, #39FF14 0%, rgba(57, 255, 20, 0.6) 100%)`,
                                                animationDelay: `${index * 0.1}s`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-[#C9D1D9] w-6 text-right">
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
