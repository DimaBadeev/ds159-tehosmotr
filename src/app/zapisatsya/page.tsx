import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/layout/PublicShell";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { STATION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Онлайн-запись на техосмотр",
  description:
    "Запишитесь на государственный технический осмотр в Минске: выбор категории ТС, даты и свободного времени. Диагностическая станция № 159.",
};

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const prices = await prisma.priceItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <PublicShell>
      <div className="bg-brand-950 py-12 text-white">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
            Онлайн-запись
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Запись на техосмотр</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            Выберите категорию, дату и свободный слот. Занятое время блокируется в базе данных.
            Адрес: {STATION.address}.
          </p>
        </div>
      </div>
      <section className="section-y">
        <div className="container-page">
          <BookingWizard prices={prices} />
        </div>
      </section>
    </PublicShell>
  );
}
