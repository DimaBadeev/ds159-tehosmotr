import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { jsonError } from "@/lib/api";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ messages });
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const id = String(body.id ?? "");
  if (!id) return jsonError("Не указан идентификатор");

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  return NextResponse.json({ message });
}
