import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    stopLossPercent: 8,
    takeProfitPercent: 15,
    maxPositionPercent: 10,
    maxOpenPositions: 3,
    solReserve: 3.0,
    trailingStopPercent: 5,
    aiScoreThreshold: 25,
    bobnetT1Enabled: true,
    bobnetT2Enabled: true,
    twitterMonitorEnabled: true,
    crossRefEnabled: true,
    autoExecute: true,
    positionSize: 5.0,
    updatedAt: new Date().toISOString(),
  });
}
