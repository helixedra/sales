import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { number, description, qty, price, discount, order_sum, order_dis } = body;

    const stmt = db.prepare("INSERT INTO orders (description, qty, price, sales_number, order_sum, order_dis) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(description, qty, price, number, order_sum, order_dis);

    return NextResponse.json({ message: "Sale added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
