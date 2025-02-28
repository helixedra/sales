import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(request: Request, { params }: { params: { number: string } }) {
  try {
    const { number } = await params;

    // Запит до бази даних для отримання інформації про файли за номером "sale"
    const stmt = db.prepare("SELECT * FROM uploads WHERE number = ? AND category = 'sale'");
    const files = stmt.all(number);

    if (files.length === 0) {
      //   return NextResponse.json({ error: "No files found for the given sale number" }, { status: 404 });
      return NextResponse.json({});
    }

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch files" },
      { status: 500 }
    );
  }
}
