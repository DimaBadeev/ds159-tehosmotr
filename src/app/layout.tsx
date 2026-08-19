import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { STATION } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: `${STATION.shortName} — техосмотр в Минске`,
    template: `%s | ${STATION.shortName}`,
  },
  description:
    "Государственный технический осмотр в Минске: запись онлайн, категории M1–M3, N1–N3 и прицепы. ул. Антоновская, 9.",
  openGraph: {
    title: `${STATION.shortName} — техосмотр в Минске`,
    description: STATION.name,
    locale: "ru_BY",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
