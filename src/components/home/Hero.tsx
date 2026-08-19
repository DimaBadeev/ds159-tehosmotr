"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { STATION } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-400"
          >
            Минск · государственная диагностика
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            Техосмотр без очередей на станции № 159
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base"
          >
            {STATION.name}. Проводим государственный технический осмотр категорий M1, M2, M3,
            N1, N2, N3 и прицепов — в том числе полноприводных автомобилей.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/zapisatsya" className="btn-primary">
              Записаться на техосмотр
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={STATION.phoneHref} className="btn-ghost">
              <Phone className="h-4 w-4" />
              {STATION.phone}
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <MapPin className="h-5 w-5 text-accent-400" />
            <p className="mt-3 text-sm font-semibold">Адрес</p>
            <p className="mt-1 text-sm text-white/70">{STATION.address}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <Clock className="h-5 w-5 text-accent-400" />
            <p className="mt-3 text-sm font-semibold">Режим работы</p>
            <p className="mt-1 text-sm text-white/70">
              {STATION.hours}. {STATION.weekend}.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:col-span-2">
            <p className="text-sm text-white/80">
              На въезде получите временный пропуск на КПП — домик рядом с воротами.
              С 2024 года можно оплатить через ЕРИП и заполнить заявление водителя прямо на станции.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
