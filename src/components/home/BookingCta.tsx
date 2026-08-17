import Link from "next/link";
import { STATION } from "@/lib/constants";

export function BookingCta() {
  return (
    <section id="onlayn-zapis" className="section-y">
      <div className="container-page">
        <div className="overflow-hidden rounded-3xl bg-brand-900 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
                Онлайн-запись
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Выберите дату и закрепите слот за собой
              </h2>
              <p className="mt-3 text-sm text-white/75">
                Свободное время рассчитывается по графику станции и уже существующим записям.
                Если нужна помощь — позвоните {STATION.phone}.
              </p>
            </div>
            <Link href="/zapisatsya" className="btn-primary">
              Записаться на техосмотр
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
