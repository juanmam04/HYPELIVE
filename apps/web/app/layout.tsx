import type { Metadata } from "next";
import { Great_Vibes, Source_Sans_3 } from "next/font/google";
import { BRAND_NAME } from "@hypelive/domain";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const disney = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-disney",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s · ${BRAND_NAME}`,
  },
  description:
    "Disney Streaming — plataforma de streaming en vivo. Canales, programas y transmisiones.",
  icons: {
    icon: "/brand-mark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${disney.variable}`}>
      <body className="min-h-screen bg-ink font-sans antialiased text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
