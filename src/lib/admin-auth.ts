import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return {
      session: null,
      error: NextResponse.json({ error: "Не авторизован" }, { status: 401 }),
    };
  }
  return { session, error: null };
}
