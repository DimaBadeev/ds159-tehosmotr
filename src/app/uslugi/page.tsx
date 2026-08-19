import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/layout/PublicShell";
import { Prices } from "@/components/home/Prices";
import { PaymentInfo } from "@/components/home/PaymentInfo";
import { BookingCta } from "@/components/home/BookingCta";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description:
    "Цены на государственный технический осмотр по категориям M1, M2, M3, N1, N2, N3 и прицепам. Диагностическая станция № 159, Минск.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const items = await prisma.priceItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <PublicShell>
      <div className="bg-brand-950 py-12 text-white">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">Услуги</p>
          <h1 className="mt-2 text-3xl font-extrabold">Услуги и цены</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            Проводим гостехосмотр всех основных категорий ТС, включая полноприводные автомобили.
            Актуальные цены редактируются администратором станции.
          </p>
        </div>
      </div>
      <Prices items={items} />
      <PaymentInfo />
      <BookingCta />
    </PublicShell>
  );
}
