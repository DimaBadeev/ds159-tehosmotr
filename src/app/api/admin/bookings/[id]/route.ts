import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { adminBookingSchema, bookingStatusSchema } from "@/lib/validations";
import { getSlotsForDate } from "@/lib/availability";
import { handleApiError, jsonError } from "@/lib/api";

type Params = { params: { id: string } };

async function syncLock(
  tx: Prisma.TransactionClient,
  booking: { id: string; date: string; timeSlot: string; status: string },
) {
  await tx.timeSlotLock.deleteMany({ where: { bookingId: booking.id } });
  if (booking.status !== "cancelled") {
    await tx.timeSlotLock.create({
      data: {
        date: booking.date,
        timeSlot: booking.timeSlot,
        bookingId: booking.id,
      },
    });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const existing = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Запись не найдена", 404);

    if (body.status && Object.keys(body).length === 1) {
      const { status } = bookingStatusSchema.parse(body);
      const updated = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
          where: { id: params.id },
          data: { status },
          include: { category: true },
        });
        await syncLock(tx, booking);
        return booking;
      });
      return NextResponse.json({ booking: updated });
    }

    const data = adminBookingSchema.partial().parse(body);
    const nextDate = data.date ?? existing.date;
    const nextTime = data.timeSlot ?? existing.timeSlot;
    const nextStatus = data.status ?? existing.status;

    if (
      nextStatus !== "cancelled" &&
      (nextDate !== existing.date || nextTime !== existing.timeSlot)
    ) {
      const availability = await getSlotsForDate(nextDate);
      const slot = availability.slots.find((item) => item.time === nextTime);
      const occupiesSame = nextDate === existing.date && nextTime === existing.timeSlot;
      if (!occupiesSame && (!availability.open || !slot?.available)) {
        return jsonError("Выбранное время недоступно", 409);
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: params.id },
        data: {
          ...(data.date ? { date: data.date } : {}),
          ...(data.timeSlot ? { timeSlot: data.timeSlot } : {}),
          ...(data.clientName ? { clientName: data.clientName } : {}),
          ...(data.phone ? { phone: data.phone.replace(/\s+/g, "") } : {}),
          ...(data.email ? { email: data.email.toLowerCase() } : {}),
          ...(data.carNumber ? { carNumber: data.carNumber.toUpperCase() } : {}),
          ...(data.carBrand ? { carBrand: data.carBrand } : {}),
          ...(data.categoryId ? { categoryId: data.categoryId } : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
          ...(data.status ? { status: data.status } : {}),
        },
        include: { category: true },
      });
      await syncLock(tx, booking);
      return booking;
    });

    return NextResponse.json({ booking: updated });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
