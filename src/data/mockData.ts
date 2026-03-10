// ============================================================
// MACRO ECONOMICS TRACKER — MOCK DATA
// Professional Financial Terminal Data Store
// ============================================================

// ─── KPI SPARKLINE DATA ──────────────────────────────────────
export interface KpiCard {
    title: string;
    value: string;
    change: string;
    changeDir: "up" | "down";
    sparkline: number[];
}

export const kpiCards: KpiCard[] = [
    {
        title: "US CPI (YoY)",
        value: "3.5%",
        change: "+0.30%",
        changeDir: "up",
        sparkline: [3.1, 3.2, 3.0, 3.3, 3.4, 3.2, 3.5, 3.4, 3.6, 3.5, 3.3, 3.5],
    },
    {
        title: "Fed Funds Rate",
        value: "5.50%",
        change: "+0.00%",
        changeDir: "up",
        sparkline: [4.5, 4.75, 5.0, 5.0, 5.25, 5.25, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5],
    },
    {
        title: "US GDP (QoQ)",
        value: "2.1%",
        change: "-0.50%",
        changeDir: "down",
        sparkline: [2.6, 2.8, 2.4, 2.2, 2.5, 2.3, 2.1, 2.4, 2.0, 2.3, 2.2, 2.1],
    },
    {
        title: "Unemployment",
        value: "3.9%",
        change: "+0.10%",
        changeDir: "up",
        sparkline: [3.5, 3.6, 3.5, 3.7, 3.6, 3.8, 3.7, 3.8, 3.9, 3.8, 3.9, 3.9],
    },
    {
        title: "10Y Treasury",
        value: "4.32%",
        change: "+0.08%",
        changeDir: "up",
        sparkline: [3.9, 4.0, 4.1, 4.0, 4.2, 4.1, 4.3, 4.2, 4.4, 4.3, 4.2, 4.32],
    },
    {
        title: "DXY Index",
        value: "106.2",
        change: "+0.45",
        changeDir: "up",
        sparkline: [103.5, 104.0, 104.8, 105.1, 104.6, 105.3, 105.8, 105.2, 106.0, 105.7, 106.1, 106.2],
    },
];

// ─── CPI vs FED RATE CHART DATA ──────────────────────────────
export interface CpiFedDataPoint {
    month: string;
    cpi: number;
    fedRate: number;
}

export const cpiFedData: CpiFedDataPoint[] = [
    { month: "Jan '24", cpi: 3.1, fedRate: 5.33 },
    { month: "Feb '24", cpi: 3.2, fedRate: 5.33 },
    { month: "Mar '24", cpi: 3.5, fedRate: 5.33 },
    { month: "Apr '24", cpi: 3.4, fedRate: 5.33 },
    { month: "May '24", cpi: 3.3, fedRate: 5.33 },
    { month: "Jun '24", cpi: 3.0, fedRate: 5.33 },
    { month: "Jul '24", cpi: 2.9, fedRate: 5.33 },
    { month: "Aug '24", cpi: 2.5, fedRate: 5.33 },
    { month: "Sep '24", cpi: 2.4, fedRate: 5.00 },
    { month: "Oct '24", cpi: 2.6, fedRate: 4.75 },
    { month: "Nov '24", cpi: 2.7, fedRate: 4.58 },
    { month: "Dec '24", cpi: 2.9, fedRate: 4.33 },
    { month: "Jan '25", cpi: 3.0, fedRate: 4.33 },
    { month: "Feb '25", cpi: 3.2, fedRate: 4.33 },
    { month: "Mar '25", cpi: 3.5, fedRate: 4.33 },
];

// ─── GDP GROWTH BAR CHART DATA ──────────────────────────────
export interface GdpGrowthDataPoint {
    country: string;
    growth: number;
    color: string;
}

export const gdpGrowthData: GdpGrowthDataPoint[] = [
    { country: "India", growth: 6.8, color: "#39FF14" },
    { country: "China", growth: 4.9, color: "#39FF14" },
    { country: "US", growth: 2.1, color: "#39FF14" },
    { country: "Japan", growth: 1.2, color: "#39FF14" },
    { country: "Germany", growth: -0.3, color: "#EF4444" },
];

// ─── NEWS SENTIMENT DATA ────────────────────────────────────
export interface NewsItem {
    id: number;
    headline: string;
    summary: string;
    source: string;
    link?: string;
    timestamp: string;
    timeAgo: string;
    sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    theme: string;
    relevance: number;
    heat?: number;
}

export const newsData: NewsItem[] = [
    {
        id: 1,
        headline: "US CPI Surges Past Expectations at 3.5% YoY",
        summary:
            "Core inflation accelerated in February, driven by shelter and services costs. Markets now pricing in delayed rate cuts.",
        source: "Reuters",
        timestamp: "2025-03-09",
        timeAgo: "4h ago",
        sentiment: "BEARISH",
        theme: "Inflation Shock",
        relevance: 98,
    },
    {
        id: 2,
        headline: "Fed's Powell Signals Patience on Rate Cuts",
        summary:
            "Chair Powell emphasized data dependency, noting progress on inflation but warning against premature easing.",
        source: "Bloomberg",
        timestamp: "2025-03-09",
        timeAgo: "5h ago",
        sentiment: "NEUTRAL",
        theme: "Rate Pivot",
        relevance: 95,
    },
    {
        id: 3,
        headline: "US Nonfarm Payrolls Beat at 275K",
        summary:
            "Labor market remains resilient with strong job creation, though wage growth moderates to 4.1% YoY.",
        source: "Bloomberg",
        timestamp: "2025-03-08",
        timeAgo: "23h ago",
        sentiment: "BULLISH",
        theme: "Labor Market",
        relevance: 91,
    },
    {
        id: 4,
        headline: "US Treasury 10Y Yield Breaks 4.5%",
        summary:
            "Rising term premium and fiscal concerns push long-end yields higher, pressuring equity valuations.",
        source: "CNBC",
        timestamp: "2025-03-09",
        timeAgo: "6h ago",
        sentiment: "BEARISH",
        theme: "Inflation Shock",
        relevance: 90,
    },
    {
        id: 5,
        headline: "Dollar Index Hits 6-Month High on Safe Haven Flows",
        summary:
            "DXY breaks 106 as geopolitical tensions and strong US data attract capital flows into dollar-denominated assets.",
        source: "FT",
        timestamp: "2025-03-09",
        timeAgo: "6h ago",
        sentiment: "BULLISH",
        theme: "Dollar Strength",
        relevance: 88,
    },
    {
        id: 6,
        headline: "Red Sea Shipping Disruptions Escalate",
        summary:
            "Houthi attacks force major rerouting of container ships, adding 10-14 days to Asia-Europe transit times.",
        source: "Reuters",
        timestamp: "2025-03-09",
        timeAgo: "7h ago",
        sentiment: "BEARISH",
        theme: "Geopolitical Risk",
        relevance: 85,
    },
    {
        id: 7,
        headline: "China Manufacturing PMI Contracts for 5th Month",
        summary:
            "Persistent weakness in China's factory sector raises concerns about global demand and commodity prices.",
        source: "CNBC",
        timestamp: "2025-03-09",
        timeAgo: "7h ago",
        sentiment: "BEARISH",
        theme: "China Slowdown",
        relevance: 82,
    },
    {
        id: 8,
        headline: "OPEC+ Extends Production Cuts Through Q2",
        summary:
            "Cartel agrees to maintain 2M bpd cuts, supporting Brent crude above $85 despite demand uncertainty.",
        source: "Reuters",
        timestamp: "2025-03-09",
        timeAgo: "8h ago",
        sentiment: "BULLISH",
        theme: "Energy Crisis",
        relevance: 79,
    },
    {
        id: 9,
        headline: "EU Announces €200B Green Infrastructure Package",
        summary:
            "European Commission unveils massive fiscal stimulus targeting energy transition and digital infrastructure.",
        source: "FT",
        timestamp: "2025-03-09",
        timeAgo: "9h ago",
        sentiment: "BULLISH",
        theme: "Fiscal Expansion",
        relevance: 74,
    },
    {
        id: 10,
        headline: "Natural Gas Prices Spike 15% on Cold Snap Forecast",
        summary:
            "European TTF futures surge as extended winter weather depletes storage reserves faster than expected.",
        source: "FT",
        timestamp: "2025-03-09",
        timeAgo: "10h ago",
        sentiment: "BEARISH",
        theme: "Energy Crisis",
        relevance: 71,
    },
    {
        id: 11,
        headline: "Biden Signs $1.2T Infrastructure Bill Extension",
        summary:
            "New spending package targets bridges, broadband, and EV charging, adding to fiscal deficit concerns.",
        source: "Reuters",
        timestamp: "2025-03-08",
        timeAgo: "1d ago",
        sentiment: "NEUTRAL",
        theme: "Fiscal Expansion",
        relevance: 68,
    },
    {
        id: 12,
        headline: "Gold Breaks $2,200 Amid Geopolitical Uncertainty",
        summary:
            "Safe-haven demand pushes precious metals to all-time highs as central bank buying accelerates globally.",
        source: "Bloomberg",
        timestamp: "2025-03-08",
        timeAgo: "1d ago",
        sentiment: "BULLISH",
        theme: "Geopolitical Risk",
        relevance: 65,
    },
];

// ─── THEME FREQUENCY DATA ──────────────────────────────────
export interface ThemeFrequency {
    theme: string;
    count: number;
}

export const themeFrequencyData: ThemeFrequency[] = [
    { theme: "Inflation Shock", count: 14 },
    { theme: "Rate Pivot", count: 11 },
    { theme: "Dollar Strength", count: 9 },
    { theme: "Labor Market", count: 8 },
    { theme: "Geopolitical Risk", count: 7 },
    { theme: "Energy Crisis", count: 6 },
    { theme: "China Slowdown", count: 4 },
    { theme: "Fiscal Expansion", count: 3 },
];

// ─── FED SPEAKER SENTIMENT DATA ──────────────────────────────
export interface FedSpeaker {
    name: string;
    role: string;
    sentiment: number; // 0-100
    stance: "Hawkish" | "Dovish" | "Neutral";
}

export const fedSpeakers: FedSpeaker[] = [
    { name: "Jerome Powell", role: "Chair", sentiment: 62, stance: "Neutral" },
    { name: "John Williams", role: "NY Fed", sentiment: 55, stance: "Neutral" },
    { name: "Christopher Waller", role: "Governor", sentiment: 78, stance: "Hawkish" },
    { name: "Raphael Bostic", role: "Atlanta Fed", sentiment: 45, stance: "Dovish" },
    { name: "Mary Daly", role: "SF Fed", sentiment: 50, stance: "Neutral" },
    { name: "Neel Kashkari", role: "Minneapolis Fed", sentiment: 72, stance: "Hawkish" },
    { name: "Austan Goolsbee", role: "Chicago Fed", sentiment: 38, stance: "Dovish" },
    { name: "Patrick Harker", role: "Philly Fed", sentiment: 58, stance: "Neutral" },
];

// ─── DATA PROVENANCE LINKS ──────────────────────────────────
export interface DataSource {
    name: string;
    url: string;
    type: string;
}

export const dataSources: DataSource[] = [
    { name: "Bureau of Labor Statistics", url: "https://www.bls.gov/cpi/", type: "CPI Data" },
    { name: "Federal Reserve (FRED)", url: "https://fred.stlouisfed.org/", type: "Fed Rate" },
    { name: "World Bank Open Data", url: "https://data.worldbank.org/", type: "GDP Data" },
    { name: "Reuters RSS Feed", url: "https://www.reuters.com/", type: "News Feed" },
    { name: "Bloomberg Terminal API", url: "https://www.bloomberg.com/", type: "Market Data" },
    { name: "IMF Data Mapper", url: "https://www.imf.org/external/datamapper", type: "Global Macro" },
];

// ─── HEATMAP MATRIX DATA ────────────────────────────────────
export interface HeatmapCell {
    value: number; // -100 to 100
}

export interface HeatmapRow {
    theme: string;
    cells: HeatmapCell[];
}

export const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const heatmapData: HeatmapRow[] = [
    {
        theme: "Inflation Shock",
        cells: [
            { value: 78 }, { value: 60 }, { value: -22 }, { value: 95 }, { value: -81 },
            { value: 68 }, { value: 50 },
        ],
    },
    {
        theme: "Rate Pivot",
        cells: [
            { value: -9 }, { value: -16 }, { value: 67 }, { value: -68 }, { value: 69 },
            { value: -13 }, { value: -55 },
        ],
    },
    {
        theme: "Dollar Strength",
        cells: [
            { value: -1 }, { value: -30 }, { value: 11 }, { value: -15 }, { value: 85 },
            { value: -43 }, { value: -28 },
        ],
    },
    {
        theme: "Labor Market",
        cells: [
            { value: -81 }, { value: -63 }, { value: 66 }, { value: 45 }, { value: -6 },
            { value: -53 }, { value: 78 },
        ],
    },
    {
        theme: "Geopolitical Risk",
        cells: [
            { value: -70 }, { value: -42 }, { value: -19 }, { value: -18 }, { value: -43 },
            { value: 58 }, { value: -65 },
        ],
    },
    {
        theme: "Energy Crisis",
        cells: [
            { value: -78 }, { value: -27 }, { value: 8 }, { value: -24 }, { value: -100 },
            { value: -6 }, { value: -88 },
        ],
    },
    {
        theme: "China Slowdown",
        cells: [
            { value: -29 }, { value: -55 }, { value: 85 }, { value: -9 }, { value: -11 },
            { value: -72 }, { value: -6 },
        ],
    },
];

// ─── ECONOMIC TIMELINE DATA ─────────────────────────────────
export interface TimelineEvent {
    date: string;
    title: string;
    category: "HIGH" | "MEDIUM" | "LOW";
    icon: string;
}

export const timelineEvents: TimelineEvent[] = [
    { date: "Mar 10", title: "US CPI Release", category: "HIGH", icon: "💰" },
    { date: "Mar 5", title: "Nonfarm Payrolls", category: "HIGH", icon: "💰" },
    { date: "Feb 28", title: "OPEC+ Output Decision", category: "MEDIUM", icon: "⚠️" },
    { date: "Feb 20", title: "Fed Minutes Released", category: "HIGH", icon: "💰" },
    { date: "Feb 15", title: "Red Sea Escalation", category: "HIGH", icon: "🔴" },
    { date: "Feb 1", title: "EU Fiscal Package", category: "MEDIUM", icon: "🏛️" },
    { date: "Jan 25", title: "China PMI Contraction", category: "MEDIUM", icon: "🏛️" },
    { date: "Jan 15", title: "Fed Rate Hold", category: "HIGH", icon: "💰" },
    { date: "Dec 28", title: "US GDP Q3 Revision", category: "MEDIUM", icon: "💰" },
];

// ─── STRESS TEST DATA ───────────────────────────────────────
export interface StressScenario {
    id: string;
    name: string;
    description: string;
}

export const stressScenarios: StressScenario[] = [
    {
        id: "recession",
        name: "Recession Risk",
        description:
            "US enters technical recession with GDP contracting for 2 consecutive quarters.",
    },
    {
        id: "energy-shock",
        name: "Energy Shock",
        description:
            "Oil surges past $120/barrel as Middle East conflict disrupts supply routes.",
    },
    {
        id: "monetary-tightening",
        name: "Monetary Tightening",
        description:
            "Fed signals surprise rate hike as inflation re-accelerates beyond target.",
    },
    {
        id: "geopolitical",
        name: "Geopolitical Crisis",
        description:
            "Major escalation in global tensions triggers flight-to-safety across markets.",
    },
    {
        id: "credit-crunch",
        name: "Credit Crunch",
        description:
            "Banking sector stress triggers credit tightening and liquidity concerns.",
    },
];

export interface AssetImpact {
    asset: string;
    category: string;
    change: number;
    sparkline: number[];
}

export interface StressTestResult {
    scenarioId: string;
    severity: number;
    overallRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    impacts: AssetImpact[];
    aiBreakdown: string;
}

export const stressTestResults: Record<string, StressTestResult> = {
    recession: {
        scenarioId: "recession",
        severity: 75,
        overallRisk: "CRITICAL",
        impacts: [
            {
                asset: "S&P 500",
                category: "Equities",
                change: -18.5,
                sparkline: [100, 97, 94, 90, 88, 85, 83, 81.5],
            },
            {
                asset: "US 10Y Treasury",
                category: "Bonds",
                change: 8.2,
                sparkline: [100, 101, 103, 105, 106, 107, 108, 108.2],
            },
            {
                asset: "Gold",
                category: "Commodities",
                change: 12.4,
                sparkline: [100, 102, 104, 106, 108, 110, 111, 112.4],
            },
            {
                asset: "EUR/USD",
                category: "FX",
                change: 3.1,
                sparkline: [100, 100.5, 101, 101.5, 102, 102.5, 103, 103.1],
            },
            {
                asset: "Crude Oil",
                category: "Commodities",
                change: -22.0,
                sparkline: [100, 96, 92, 88, 84, 82, 80, 78],
            },
            {
                asset: "Corporate Bonds",
                category: "Bonds",
                change: -6.8,
                sparkline: [100, 98, 97, 96, 95, 94, 93.5, 93.2],
            },
        ],
        aiBreakdown:
            "Recession scenario projects significant equity drawdowns (-18.5%) as earnings expectations collapse. Treasury bonds rally on flight-to-quality and rate cut expectations. Gold benefits from risk-off sentiment and weakening dollar. Corporate bonds face widening spreads as default risk increases. Oil drops sharply on demand destruction expectations. FX sees mild dollar weakness as Fed is forced to cut rates aggressively.",
    },
    "energy-shock": {
        scenarioId: "energy-shock",
        severity: 65,
        overallRisk: "HIGH",
        impacts: [
            {
                asset: "S&P 500",
                category: "Equities",
                change: -11.2,
                sparkline: [100, 98, 96, 93, 91, 90, 89, 88.8],
            },
            {
                asset: "US 10Y Treasury",
                category: "Bonds",
                change: -3.5,
                sparkline: [100, 99.5, 99, 98, 97.5, 97, 96.8, 96.5],
            },
            {
                asset: "Gold",
                category: "Commodities",
                change: 9.8,
                sparkline: [100, 102, 104, 105, 107, 108, 109, 109.8],
            },
            {
                asset: "Crude Oil",
                category: "Commodities",
                change: 35.0,
                sparkline: [100, 106, 112, 118, 124, 128, 132, 135],
            },
            {
                asset: "EUR/USD",
                category: "FX",
                change: -4.2,
                sparkline: [100, 99, 98, 97.5, 97, 96.5, 96, 95.8],
            },
            {
                asset: "Corporate Bonds",
                category: "Bonds",
                change: -8.1,
                sparkline: [100, 98, 96, 95, 94, 93, 92.5, 91.9],
            },
        ],
        aiBreakdown:
            "Energy shock drives crude oil prices up 35%, creating severe inflationary pressures across the economy. Equities decline on squeezed margins and consumer spending contraction. Bond yields rise (prices fall) as inflation expectations surge, forcing hawkish central bank response. Dollar strengthens on safe-haven flows. Gold rallies on inflation hedge demand. Corporate bonds sell off on deteriorating credit conditions.",
    },
    "monetary-tightening": {
        scenarioId: "monetary-tightening",
        severity: 60,
        overallRisk: "HIGH",
        impacts: [
            {
                asset: "S&P 500",
                category: "Equities",
                change: -14.3,
                sparkline: [100, 97, 95, 92, 90, 88, 86, 85.7],
            },
            {
                asset: "US 10Y Treasury",
                category: "Bonds",
                change: -7.5,
                sparkline: [100, 99, 97, 96, 95, 94, 93, 92.5],
            },
            {
                asset: "Gold",
                category: "Commodities",
                change: -5.2,
                sparkline: [100, 99, 98, 97, 96, 95.5, 95, 94.8],
            },
            {
                asset: "EUR/USD",
                category: "FX",
                change: -6.8,
                sparkline: [100, 99, 97.5, 96, 95, 94, 93.5, 93.2],
            },
            {
                asset: "Crude Oil",
                category: "Commodities",
                change: -8.0,
                sparkline: [100, 98, 96, 95, 94, 93, 92.5, 92],
            },
            {
                asset: "Corporate Bonds",
                category: "Bonds",
                change: -12.1,
                sparkline: [100, 97, 95, 93, 91, 90, 89, 87.9],
            },
        ],
        aiBreakdown:
            "Surprise monetary tightening hammers all risk assets. Equities face multiple compression as discount rates rise sharply. Bond prices fall across the curve with long-duration assets hit hardest. Dollar surges on higher yield differentials. Gold declines as opportunity cost of holding non-yielding assets increases. Corporate credit spreads widen dramatically as financing conditions deteriorate and default probabilities increase.",
    },
    geopolitical: {
        scenarioId: "geopolitical",
        severity: 80,
        overallRisk: "CRITICAL",
        impacts: [
            {
                asset: "S&P 500",
                category: "Equities",
                change: -15.8,
                sparkline: [100, 96, 93, 90, 88, 86, 85, 84.2],
            },
            {
                asset: "US 10Y Treasury",
                category: "Bonds",
                change: 6.5,
                sparkline: [100, 101.5, 103, 104, 105, 105.5, 106, 106.5],
            },
            {
                asset: "Gold",
                category: "Commodities",
                change: 18.2,
                sparkline: [100, 104, 108, 111, 114, 116, 117.5, 118.2],
            },
            {
                asset: "Crude Oil",
                category: "Commodities",
                change: 28.0,
                sparkline: [100, 105, 110, 116, 120, 124, 126, 128],
            },
            {
                asset: "EUR/USD",
                category: "FX",
                change: -5.5,
                sparkline: [100, 99, 98, 97, 96, 95.5, 95, 94.5],
            },
            {
                asset: "Corporate Bonds",
                category: "Bonds",
                change: -9.3,
                sparkline: [100, 98, 96, 94.5, 93, 92, 91.5, 90.7],
            },
        ],
        aiBreakdown:
            "Geopolitical escalation triggers classic risk-off positioning. Safe havens (gold, treasuries) rally sharply while equities face broad-based selling. Oil surges on supply disruption fears. Dollar strengthens against all major currencies on safe-haven demand. Corporate credit markets seize up temporarily as risk premiums spike. Defense and energy sectors outperform while consumer discretionary and tech lead declines.",
    },
    "credit-crunch": {
        scenarioId: "credit-crunch",
        severity: 70,
        overallRisk: "HIGH",
        impacts: [
            {
                asset: "S&P 500",
                category: "Equities",
                change: -20.1,
                sparkline: [100, 96, 92, 88, 85, 83, 81, 79.9],
            },
            {
                asset: "US 10Y Treasury",
                category: "Bonds",
                change: 10.5,
                sparkline: [100, 102, 104, 106, 107.5, 109, 110, 110.5],
            },
            {
                asset: "Gold",
                category: "Commodities",
                change: 14.8,
                sparkline: [100, 103, 106, 108, 110, 112, 113.5, 114.8],
            },
            {
                asset: "EUR/USD",
                category: "FX",
                change: 2.3,
                sparkline: [100, 100.5, 101, 101.3, 101.8, 102, 102.2, 102.3],
            },
            {
                asset: "Crude Oil",
                category: "Commodities",
                change: -15.0,
                sparkline: [100, 97, 94, 91, 89, 87, 86, 85],
            },
            {
                asset: "Corporate Bonds",
                category: "Bonds",
                change: -18.5,
                sparkline: [100, 96, 92, 89, 86, 84, 82.5, 81.5],
            },
        ],
        aiBreakdown:
            "Credit crunch scenario produces the worst outcomes for risk assets as financial contagion spreads. Equities plunge on banking sector fears and earnings downgrades. Corporate bonds face massive spread widening as default risk surges. Treasury bonds rally sharply as the Fed is expected to cut rates and inject liquidity. Gold benefits from systemic risk hedging. Dollar weakens on Fed easing expectations. Oil drops on anticipated demand destruction from economic contraction.",
    },
};

// ─── DASHBOARD LEGACY DATA ───────────────────────────────────
export const dashboardData = {
    themes: [
        "Inflation Shock",
        "Rate Pivot",
        "Dollar Strength",
        "Energy Crisis",
        "China Slowdown",
        "Labor Market",
        "Geopolitical Risk",
    ],
    briefing:
        "Global macro conditions remain volatile as CPI reaccelerates to 3.5% YoY, driving 10Y yields past 4.3%. Fed rhetoric signals prolonged restrictive stance while geopolitical risks add supply-side inflationary pressures. Risk assets face headwinds from multiple fronts.",
    heatmap: [
        { label: "CPI", value: 3.5, status: "pos" as const },
        { label: "PPI", value: 1.2, status: "pos" as const },
        { label: "GDP", value: 2.1, status: "pos" as const },
        { label: "Unemployment", value: 3.9, status: "neg" as const },
        { label: "Fed Rate", value: 5.5, status: "neg" as const },
        { label: "DXY", value: 0.5, status: "pos" as const },
    ],
    stress_test: {
        probability: "68%",
        scenario: "Recession Risk",
        impact: "S&P -18% / UST +8%",
    },
    events: [
        { time: "10:30", title: "US CPI Release", impact: "HIGH" },
        { time: "14:00", title: "Fed Rate Decision", impact: "HIGH" },
        { time: "08:15", title: "Nonfarm Payrolls", impact: "MEDIUM" },
        { time: "11:00", title: "OPEC Meeting", impact: "MEDIUM" },
    ],
};
