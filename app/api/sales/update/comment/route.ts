import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, comment } = body;

    if (!number) {
      return NextResponse.json({ error: "Number is required" }, { status: 400 });
    }

    const result = db
      .prepare(
        `UPDATE sales
         SET comment = ?
         WHERE number = ?`
      )
      .run(comment, number);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
