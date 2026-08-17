import Link from "next/link";
import { FileText } from "lucide-react";
import { REQUIRED_DOCUMENTS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DocumentsPreview() {
  return (
    <section id="dokumenty" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Необходимые документы"
          title="Что взять с собой"
          description="Подготовьте документы заранее — так осмотр пройдёт быстрее. Заявление водителя можно заполнить на станции."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REQUIRED_DOCUMENTS.map((doc) => (
            <article key={doc.title} className="rounded-2xl border border-slate-200 p-5">
              <FileText className="h-5 w-5 text-brand-700" />
              <h3 className="mt-3 font-bold text-brand-900">{doc.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{doc.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/dokumenty" className="text-sm font-semibold text-brand-700 hover:underline">
            Подробнее на странице документов
          </Link>
        </div>
      </div>
    </section>
  );
}
