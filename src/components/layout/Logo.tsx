import Link from "next/link";
import { STATION } from "@/lib/constants";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500 text-brand-950 shadow-sm">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
          <path
            d="M6 18 16 8l10 10v8H6v-8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M12 26v-6h8v6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <path
            d="M11 16.5 16 12l5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={`block text-sm font-extrabold tracking-tight sm:text-base ${light ? "text-white" : "text-brand-900"}`}
        >
          {STATION.shortName}
        </span>
        <span
          className={`block max-w-[14rem] text-[11px] font-medium sm:max-w-none sm:text-xs ${light ? "text-white/70" : "text-slate-500"}`}
        >
          УПТЦ МГУ МЧС РБ · Минск
        </span>
      </span>
    </Link>
  );
}
