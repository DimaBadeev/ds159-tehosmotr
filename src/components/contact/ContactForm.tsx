"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { Spinner } from "@/components/ui/Spinner";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "+375", email: "", message: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось отправить");
      toast.success("Сообщение отправлено. Мы свяжемся с вами.");
      form.reset({ name: "", phone: "+375", email: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <label>
        <span className="label">Имя</span>
        <input className="input" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
        ) : null}
      </label>
      <label>
        <span className="label">Телефон</span>
        <input className="input" {...form.register("phone")} />
        {form.formState.errors.phone ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p>
        ) : null}
      </label>
      <label>
        <span className="label">Email</span>
        <input className="input" type="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </label>
      <label>
        <span className="label">Сообщение</span>
        <textarea className="input min-h-28" {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.message.message}</p>
        ) : null}
      </label>
      <button type="submit" className="btn-navy w-full" disabled={submitting}>
        {submitting ? <Spinner className="h-4 w-4" /> : null}
        Отправить
      </button>
    </form>
  );
}
