//SELECT * FROM `sales`

import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET() {
  const sales = db.prepare("SELECT * FROM `sales` ORDER BY `id` DESC").all();
  return NextResponse.json(sales);
}
