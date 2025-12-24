import { NextResponse } from "next/server";

import { ensureDbUser } from "@/lib/auth";

export async function GET() {
  const dbUser = await ensureDbUser();
  if (!dbUser) {
    return NextResponse.json({ role: "user" }, { status: 200 });
  }
  return NextResponse.json({ role: dbUser.role });
}
