import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { workingHoursSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api";
import { z } from "zod";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [hours, closures] = await Promise.all([
    prisma.workingHours.findMany({ orderBy: { weekday: "asc" } }),
    prisma.extraClosure.findMany({ orderBy: { date: "asc" } }),
  ]);

  return NextResponse.json({ hours, closures });
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const items = z.array(workingHoursSchema).parse(body.hours);

    await prisma.$transaction(
      items.map((item) =>
        prisma.workingHours.upsert({
          where: { weekday: item.weekday },
          update: item,
          create: item,
        }),
      ),
    );

    const hours = await prisma.workingHours.findMany({ orderBy: { weekday: "asc" } });
    return NextResponse.json({ hours });
  } catch (err) {
    return handleApiError(err);
  }
}
