import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { adminBookingSchema } from "@/lib/validations";
import { getSlotsForDate } from "@/lib/availability";
import { handleApiError, jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status") ?? "";
  const date = searchParams.get("date") ?? "";

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(date ? { date } : {}),
      ...(query
        ? {
            OR: [
              { clientName: { contains: query } },
              { phone: { contains: query.replace(/\s+/g, "") } },
              { carNumber: { contains: query } },
              { email: { contains: query } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ date: "desc" }, { timeSlot: "desc" }],
    take: 300,
  });

  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const data = adminBookingSchema.parse(body);
    const status = data.status ?? "confirmed";

    const category = await prisma.priceItem.findFirst({
      where: { id: data.categoryId, isActive: true },
    });
    if (!category) return jsonError("Категория не найдена");

    if (status !== "cancelled") {
      const availability = await getSlotsForDate(data.date);
      const slot = availability.slots.find((item) => item.time === data.timeSlot);
      if (!availability.open || !slot?.available) {
        return jsonError("Выбранное время недоступно", 409);
      }
    }

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          date: data.date,
          timeSlot: data.timeSlot,
          clientName: data.clientName,
          phone: data.phone.replace(/\s+/g, ""),
          email: data.email.toLowerCase(),
          carNumber: data.carNumber.toUpperCase(),
          carBrand: data.carBrand,
          categoryId: data.categoryId,
          notes: data.notes ?? "",
          status,
          source: "admin",
        },
        include: { category: true },
      });

      if (status !== "cancelled") {
        await tx.timeSlotLock.create({
          data: {
            date: data.date,
            timeSlot: data.timeSlot,
            bookingId: created.id,
          },
        });
      }

      return created;
    });

    return NextResponse.json({ booking });
  } catch (err) {
    return handleApiError(err);
  }
}
