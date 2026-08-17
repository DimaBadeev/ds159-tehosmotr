import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/PublicShell";
import { REQUIRED_DOCUMENTS } from "@/lib/constants";
import { BookingCta } from "@/components/home/BookingCta";

export const metadata: Metadata = {
  title: "Документы для техосмотра",
  description:
    "Список документов для прохождения гостехосмотра: техпаспорт, водительское удостоверение, паспорт, акт ГБО и оплата разрешения на допуск.",
};

export default function DocumentsPage() {
  return (
    <PublicShell>
      <div className="bg-brand-950 py-12 text-white">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">Документы</p>
          <h1 className="mt-2 text-3xl font-extrabold">Необходимые документы</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            Возьмите оригиналы. Заявление водителя можно заполнить на станции, оплату разрешения —
            провести через ЕРИП.
          </p>
        </div>
      </div>
      <section className="section-y">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {REQUIRED_DOCUMENTS.map((doc, index) => (
            <article key={doc.title} className="card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-xl font-bold text-brand-900">{doc.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{doc.text}</p>
            </article>
          ))}
        </div>
      </section>
      <BookingCta />
    </PublicShell>
  );
}
