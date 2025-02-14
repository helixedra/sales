import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, description, qty, price, order_sum, order_dis } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Sale number is required" }, { status: 400 });
    }

    const result = db
      .prepare(
        `UPDATE orders
       SET description = ?, qty = ?, price = ?, order_sum = ?, order_dis = ?
       WHERE order_id = ?`
      )
      .run(description, qty, price, order_sum, order_dis, order_id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sale status updated successfully" });
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
