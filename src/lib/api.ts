import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError(error.errors[0]?.message ?? "Ошибка валидации", 400);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return jsonError("Это время уже занято. Выберите другой слот.", 409);
  }
  console.error(error);
  return jsonError("Внутренняя ошибка сервера", 500);
}
