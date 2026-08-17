"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Tags,
  ClipboardList,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Записи", icon: ClipboardList },
  { href: "/admin/schedule", label: "Расписание", icon: CalendarClock },
  { href: "/admin/prices", label: "Цены", icon: Tags },
  { href: "/admin/messages", label: "Сообщения", icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const nav = (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
              active ? "bg-brand-800 text-white" : "text-slate-600 hover:bg-slate-100",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Logo />
        <div className="mt-8">{nav}</div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-8 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Logo />
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Меню">
            {open ? <X /> : <Menu />}
          </button>
        </header>
        {open ? <div className="border-b border-slate-200 bg-white p-4 lg:hidden">{nav}</div> : null}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
