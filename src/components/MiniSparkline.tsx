"use client";

interface MiniSparklineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
}

export default function MiniSparkline({
    data,
    color = "#39FF14",
    width = 60,
    height = 24,
}: MiniSparklineProps) {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    });

    return (
        <svg width={width} height={height} className="overflow-visible">
            {/* Gradient */}
            <defs>
                <linearGradient id={`spark-grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>

            {/* Area fill */}
            <polygon
                points={`0,${height} ${points.join(" ")} ${width},${height}`}
                fill={`url(#spark-grad-${color.replace("#", "")})`}
            />

            {/* Line */}
            <polyline
                points={points.join(" ")}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* End dot */}
            {data.length > 0 && (
                <circle
                    cx={width}
                    cy={height - ((data[data.length - 1] - min) / range) * height}
                    r={2}
                    fill={color}
                />
            )}
        </svg>
    );
}
