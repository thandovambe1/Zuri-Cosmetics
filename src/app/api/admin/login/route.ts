import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminLogin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";
  if (!(await verifyAdminLogin(password))) {
    return NextResponse.json(
      { ok: false, message: "Incorrect admin password." },
      { status: 401 }
    );
  }
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
