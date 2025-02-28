//SELECT * FROM `sales`

import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET() {
  try {
    const salesData = db
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
        json_group_array(
            json_object(
                'order_id', orders.order_id,
                'created', orders.created,
                'description', orders.description,
                'qty', orders.qty,
                'price', orders.price,
                'order_sum', orders.order_sum,
                'order_dis', orders.order_dis
            )
        ) AS orders
FROM
        sales
LEFT JOIN
        orders ON sales.number = orders.sales_number
GROUP BY
        sales.id, sales.date, sales.status, sales.number, sales.client, sales.email, sales.tel, 
        sales.address, sales.delivery, sales.deadline, sales.prepay, sales.comment
ORDER BY
        sales.number DESC;
`
      )
      .all();

    if (!salesData) {
      return NextResponse.json({ error: "Sales not found" }, { status: 404 });
    }

    // Пройдіться по всьому масиву і конвертуйте поле orders для кожного об'єкта
    salesData.forEach((sale: any) => {
      if (typeof sale.orders === "string") {
        sale.orders = JSON.parse(sale.orders);
      }
    });

    return NextResponse.json(salesData);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
