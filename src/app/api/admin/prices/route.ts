import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { priceUpdateSchema } from "@/lib/validations";
import { handleApiError, jsonError } from "@/lib/api";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.priceItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ items });
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!id) return jsonError("Не указан идентификатор");

    const data = priceUpdateSchema.parse(body);
    const item = await prisma.priceItem.update({
      where: { id },
      data,
    });
    return NextResponse.json({ item });
  } catch (err) {
    return handleApiError(err);
  }
}
