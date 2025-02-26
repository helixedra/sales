// pages/api/inventory.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Type for inventory item
type InventoryItem = {
  id: number;
  category: string;
  name: string;
  thickness: number;
  length: number;
  width: number;
  note: string | null;
};

export async function GET() {
  const items = db.prepare("SELECT id, category, name, thickness, length, width, note FROM inventory_items ORDER BY category, name").all();
  return NextResponse.json(items);
}
