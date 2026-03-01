import { NextResponse } from "next/server";
import { autoAssignCars } from "@/lib/eventStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    prioritizeOfficers?: boolean;
  };

  const data = await autoAssignCars(Boolean(body.prioritizeOfficers ?? true));
  return NextResponse.json(data);
}
