// {
//    "number": "1",
//     "clientName": "dasdf",
//     "email": "",
//     "phone": "34345",
//     "address": "ul. Andrzeja Struga 49, Apt. 53",
//     "term": "30",
//     "prepayment": "0",
//     "comment": "",
//     "orderItems": [
//         {
//             "id": 1,
//             "description": "sfddfdf",
//             "quantity": "1",
//             "price": "2222",
//             "discount": "5%"
//         }
//     ]
// }

// CREATE TABLE "sales" (
// 	"id"	int NOT NULL,
// 	"date"	timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
// 	"status"	varchar(255) NOT NULL,
// 	"number"	int NOT NULL,
// 	"client"	varchar(255) NOT NULL,
// 	"email"	varchar(255) NOT NULL,
// 	"tel"	varchar(255) NOT NULL,
// 	"address"	varchar(500) NOT NULL,
// 	"delivery"	varchar(255) NOT NULL,
// 	"deadline"	int NOT NULL,
// 	"prepay"	int NOT NULL,
// 	"comment"	text NOT NULL
// );

// CREATE TABLE "orders" (
// 	"order_id"	int NOT NULL,
// 	"created"	timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
// 	"description"	text NOT NULL,
// 	"qty"	int NOT NULL,
// 	"price"	int NOT NULL,
// 	"sales_number"	int NOT NULL,
// 	"order_sum"	int NOT NULL,
// 	"order_dis"	decimal(10, 2) NOT NULL
// );

import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, clientName, email, phone, address, term, prepayment, comment, orderItems } =
      body;

    const stmt = db.prepare(
      "INSERT INTO sales (status, number, client, email, tel, address, delivery, deadline, prepay, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const info = stmt.run(
      "new",
      number,
      clientName,
      email,
      phone,
      address,
      "",
      term,
      prepayment,
      comment
    );

    const orderStmt = db.prepare(
      "INSERT INTO orders (description, qty, price, sales_number, order_sum, order_dis) VALUES (?, ?, ?, ?, ?, ?)"
    );
    orderItems.forEach((item) => {
      orderStmt.run(
        item.description,
        item.quantity,
        item.price,
        number,
        item.quantity * item.price,
        item.discount / 100
      );
    });

    return NextResponse.json({ message: "Sale added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
