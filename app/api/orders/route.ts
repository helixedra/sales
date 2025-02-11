//SELECT * FROM `orders`

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const orders = db.prepare("SELECT * FROM `orders`").all();
  return NextResponse.json(orders);
}
