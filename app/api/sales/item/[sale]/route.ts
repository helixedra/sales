import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(request: Request, { params }: { params: { sale: string } }) {
  const { sale } = await params;

  if (!sale) {
    return NextResponse.json({ error: "Sale number is required" }, { status: 400 });
  }

  try {
    const saleData = db
      .prepare(
        `SELECT
          sales.id,
          sales.date,
          sales.status,
          sales.number,
          sales.client,
          sales.email,
          sales.tel,
          sales.address,
          sales.delivery,
          sales.deadline,
          sales.prepay,
          sales.comment,
          CASE
            WHEN COUNT(orders.order_id) = 0 THEN '[]'
            ELSE json_group_array(
              json_object(
                'order_id', orders.order_id,
                'created', orders.created,
                'description', orders.description,
                'qty', orders.qty,
                'price', orders.price,
                'order_sum', orders.order_sum,
                'order_dis', orders.order_dis
              )
            )
          END AS orders
        FROM
          sales
        LEFT JOIN
          orders ON sales.number = orders.sales_number
        WHERE
          sales.number = ?
        GROUP BY
          sales.id, sales.date, sales.status, sales.number, sales.client, sales.email, sales.tel, 
          sales.address, sales.delivery, sales.deadline, sales.prepay, sales.comment`
      )
      .get(sale);

    if (!saleData) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    // If orders is returned as a JSON string, parse it
    if (typeof (saleData as any).orders === "string") {
      (saleData as any).orders = JSON.parse((saleData as any).orders);
    }

    return NextResponse.json(saleData);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
