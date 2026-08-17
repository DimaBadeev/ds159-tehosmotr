import { NextRequest } from "next/server";
import { getSlotsForDate } from "@/lib/availability";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonError("Укажите дату в формате YYYY-MM-DD");
  }

  const result = await getSlotsForDate(date);
  return Response.json(result);
}
