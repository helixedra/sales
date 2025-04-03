import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
  const body = await request.json();

  const { id, category, name, thickness, length, width, quantity, note } = body;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = db
      .prepare(
        `UPDATE inventory_items
     SET category = ?, name = ?, thickness = ?, length = ?, width = ?, quantity = ?, note = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
      )
      .run(category, name, thickness, length, width, quantity, note, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Doesn't updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
