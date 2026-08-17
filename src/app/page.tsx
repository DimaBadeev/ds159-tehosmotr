import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/layout/PublicShell";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Advantages } from "@/components/home/Advantages";
import { GallerySlider } from "@/components/home/GallerySlider";
import { Prices } from "@/components/home/Prices";
import { DocumentsPreview } from "@/components/home/DocumentsPreview";
import { PaymentInfo } from "@/components/home/PaymentInfo";
import { MapSection } from "@/components/home/MapSection";
import { BookingCta } from "@/components/home/BookingCta";
import { STATION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Главная",
  description: `${STATION.name}: гостехосмотр в Минске на ул. Антоновская, 9. Онлайн-запись, ЕРИП, категории M, N, O и мотоциклы.`,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await prisma.priceItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: STATION.name,
    telephone: STATION.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: STATION.street,
      addressLocality: "Минск",
      postalCode: "220088",
      addressCountry: "BY",
    },
    openingHours: "Mo-Fr 09:00-17:00",
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Advantages />
      <GallerySlider />
      <Prices items={items} />
      <DocumentsPreview />
      <PaymentInfo />
      <MapSection />
      <BookingCta />
    </PublicShell>
  );
}
