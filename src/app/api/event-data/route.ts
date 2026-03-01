import { NextResponse } from "next/server";
import { getEventData } from "@/lib/eventStore";

export const runtime = "nodejs";

export async function GET() {
  const data = await getEventData();
  return NextResponse.json(data);
}
