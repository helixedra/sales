import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const result = db.prepare(`DELETE FROM inventory_items WHERE id = ?`).run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Doesn't deleted" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
