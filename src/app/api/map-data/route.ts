import { NextResponse } from "next/server";
import pool from "@/lib/db/pool";

export async function GET() {
  try {
    const pantryResult = await pool.query('SELECT * FROM "Pantry"');
    const censusResult = await pool.query('SELECT * FROM "CensusData"');

    return NextResponse.json({
      pantries: pantryResult.rows,
      censusStats: censusResult.rows,
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return NextResponse.json(
      { error: "Failed to fetch map data", pantries: [], censusStats: [] },
      { status: 500 }
    );
  }
}
