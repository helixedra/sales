import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = db.prepare("SELECT * FROM users").all();
  return NextResponse.json(users);
}

// export async function POST(request: Request) {
//   const { name, email } = await request.json();

//   try {
//     addUser(name, email);
//     return NextResponse.json({ message: "User added successfully" }, { status: 201 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Error adding user", error: errorMessage }, { status: 500 });
//   }
// }
