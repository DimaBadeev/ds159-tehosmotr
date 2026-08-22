import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingFormSchema } from "@/lib/validations";
import { getSlotsForDate } from "@/lib/availability";
import { getMinskYmd } from "@/lib/utils";
import { handleApiError, jsonError } from "@/lib/api";
import { STATION, WHAT_TO_BRING } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingFormSchema.parse(body);
    const today = getMinskYmd();

    if (data.date < today) {
      return jsonError("Нельзя записаться на прошедшую дату");
    }

    const category = await prisma.priceItem.findFirst({
      where: { id: data.categoryId, isActive: true, isExtra: false },
    });
    if (!category) {
      return jsonError("Выбранная категория недоступна");
    }

    const availability = await getSlotsForDate(data.date);
    const slot = availability.slots.find((item) => item.time === data.timeSlot);
    if (!availability.open || !slot?.available) {
      return jsonError("Выбранное время недоступно", 409);
    }

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          date: data.date,
          timeSlot: data.timeSlot,
          clientName: data.clientName,
          phone: data.phone,
          email: (data.email ?? "").toLowerCase(),
          carNumber: data.carNumber,
          carBrand: data.carBrand,
          categoryId: data.categoryId,
          notes: data.notes ?? "",
          status: "pending",
          source: "online",
        },
        include: { category: true },
      });

      await tx.timeSlotLock.create({
        data: {
          date: data.date,
          timeSlot: data.timeSlot,
          bookingId: created.id,
        },
      });

      return created;
    });

    return NextResponse.json({
      booking: {
        id: booking.id,
        date: booking.date,
        timeSlot: booking.timeSlot,
        clientName: booking.clientName,
        phone: booking.phone,
        email: booking.email,
        carNumber: booking.carNumber,
        carBrand: booking.carBrand,
        category: booking.category.name,
        status: booking.status,
        address: STATION.address,
        whatToBring: WHAT_TO_BRING,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
