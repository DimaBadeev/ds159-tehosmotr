import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-900">Страница не найдена</h1>
        <p className="mt-2 text-slate-600">Проверьте адрес или вернитесь на главную.</p>
        <Link href="/" className="btn-navy mt-6">
          На главную
        </Link>
      </div>
    </PublicShell>
  );
}
