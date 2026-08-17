import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { closureSchema } from "@/lib/validations";
import { handleApiError, jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const data = closureSchema.parse(body);
    const closure = await prisma.extraClosure.create({ data });
    return NextResponse.json({ closure });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("Не указан идентификатор");

  await prisma.extraClosure.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
