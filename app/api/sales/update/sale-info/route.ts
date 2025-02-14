import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, client, email, tel, address, deadline, prepay } = body;

    if (!number) {
      return NextResponse.json({ error: "Sale number is required" }, { status: 400 });
    }

    const result = db
      .prepare(
        `UPDATE sales
       SET client = ?, email = ?, tel = ?, address = ?, deadline = ?, prepay = ?
       WHERE number = ?`
      )
      .run(client, email, tel, address, deadline, prepay, number);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sale status updated successfully" });
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
