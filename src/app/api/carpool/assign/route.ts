import { NextResponse } from "next/server";
import { assignRiderToCar } from "@/lib/eventStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    riderId: string;
    carId: string | null;
    seatIndex: number | null;
    sheetId?: string;
  };

  const data = await assignRiderToCar(body.riderId, body.carId, body.seatIndex, body.sheetId);
  return NextResponse.json(data);
}
