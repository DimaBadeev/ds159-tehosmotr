"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { NAV_LINKS, STATION } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    cn(
      "rounded-full px-3 py-1.5 text-sm font-medium transition",
      pathname === href
        ? "bg-brand-50 text-brand-800"
        : "text-slate-600 hover:bg-slate-50 hover:text-brand-800",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={STATION.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-brand-800"
          >
            <Phone className="h-4 w-4 text-accent-600" />
            {STATION.phone}
          </a>
          <Link href="/zapisatsya" className="btn-primary">
            Записаться на техосмотр
          </Link>
        </div>
        <button
          type="button"
          className="rounded-xl p-2 text-brand-800 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="container-page flex flex-col gap-2 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a href={STATION.phoneHref} className="px-3 py-1.5 text-sm font-semibold text-brand-800">
                {STATION.phone}
              </a>
              <Link href="/zapisatsya" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Записаться на техосмотр
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
