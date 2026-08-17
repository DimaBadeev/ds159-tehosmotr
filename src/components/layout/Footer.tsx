import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, STATION } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            {STATION.name}. {STATION.legalName}. Государственный технический осмотр
            транспортных средств, в том числе полноприводных автомобилей.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
            Навигация
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin/login" className="hover:text-white/80">
                Вход для сотрудников
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3 text-sm text-white/80">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
            Контакты
          </p>
          <p className="flex gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
            {STATION.address}
          </p>
          <p className="flex gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
            <a href={STATION.phoneHref} className="hover:text-white">
              {STATION.phone}
            </a>
          </p>
          <p className="flex gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
            {STATION.hours}. {STATION.weekend}.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {STATION.shortName}. Все права защищены.</p>
          <p>Сайт носит информационный характер и не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
}
