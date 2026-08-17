import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone.replace(/\s+/g, ""),
        email: data.email.toLowerCase(),
        message: data.message,
      },
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (error) {
    return handleApiError(error);
  }
}
