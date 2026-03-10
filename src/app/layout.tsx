import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata = {
    title: "Macro View Terminal | Financial Dashboard",
    description:
        "Professional macroeconomic tracking dashboard with AI-powered news analysis, theme heatmaps, and scenario stress testing.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
                style={{ background: "#0E1117", color: "#C9D1D9" }}
            >
                <div className="flex min-h-screen">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ maxHeight: "100vh" }}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}