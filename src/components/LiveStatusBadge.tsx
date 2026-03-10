"use client";

interface LiveStatusBadgeProps {
    isLive: boolean;
    isLoading: boolean;
    lastUpdated: Date | null;
    error: string | null;
    onRefresh?: () => void;
}

export default function LiveStatusBadge({
    isLive,
    isLoading,
    lastUpdated,
    error,
    onRefresh,
}: LiveStatusBadgeProps) {
    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

    return (
        <div className="flex items-center gap-3 text-[10px] font-mono">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5">
                <span
                    className={`w-2 h-2 rounded-full ${isLoading
                            ? "bg-yellow-500 animate-pulse"
                            : isLive
                                ? "bg-[#39FF14] pulse-glow"
                                : "bg-[#8B949E]"
                        }`}
                />
                <span className={isLive ? "text-[#39FF14]" : "text-[#8B949E]"}>
                    {isLoading ? "SYNCING" : isLive ? "LIVE" : "MOCK DATA"}
                </span>
            </div>

            {/* Last updated time */}
            {lastUpdated && (
                <span className="text-[#8B949E]">
                    LAST_SYNC: {formatTime(lastUpdated)}
                </span>
            )}

            {/* Error tooltip */}
            {error && !isLive && (
                <span
                    className="text-[#EF4444] cursor-help"
                    title={error}
                >
                    ⚠ {error.length > 30 ? error.slice(0, 27) + "..." : error}
                </span>
            )}

            {/* Refresh button */}
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="text-[#8B949E] hover:text-[#39FF14] transition-colors"
                    title="Refresh data"
                >
                    <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className={isLoading ? "animate-spin" : ""}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
