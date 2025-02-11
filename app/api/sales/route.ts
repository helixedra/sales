//SELECT * FROM `sales`

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const sales = db.prepare("SELECT * FROM `sales`").all();
  return NextResponse.json(sales);
}
