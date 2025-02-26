import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { category, name, thickness, length, width, note } = body;

    const stmt = db.prepare("INSERT INTO inventory_items (category, name, thickness, length, width, note) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(category, name, thickness, length, width, note);

    return NextResponse.json({ message: "Sale added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
