"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Logo } from "@/components/layout/Logo";
import { Spinner } from "@/components/ui/Spinner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ds159.by");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Неверный логин или пароль");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card">
        <Logo />
        <h1 className="mt-6 text-2xl font-extrabold text-brand-900">Вход в админку</h1>
        <p className="mt-2 text-sm text-slate-500">Только для сотрудников диагностической станции.</p>
        <label className="mt-6 block">
          <span className="label">Email</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-4 block">
          <span className="label">Пароль</span>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="btn-navy mt-6 w-full" disabled={loading}>
          {loading ? <Spinner className="h-4 w-4" /> : null}
          Войти
        </button>
      </form>
    </div>
  );
}
