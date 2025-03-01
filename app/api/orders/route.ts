import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { Order } from '@/app/types/order';

export async function GET() {
  try {
    const orders = db
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
                'id', items.id,
                'created', items.created,
                'description', items.description,
                'quantity', items.quantity,
                'price', items.price,
                'total', items.total,
                'discount', items.discount
            )
        ) AS items
FROM
        sales
LEFT JOIN
        items ON sales.number = items.order_number
GROUP BY
        sales.id, sales.date, sales.status, sales.number, sales.client, sales.email, sales.tel, 
        sales.address, sales.delivery, sales.deadline, sales.prepay, sales.comment
ORDER BY
        sales.number DESC;
`
      )
      .all();

    if (!orders) {
      return NextResponse.json({ error: 'Sales not found' }, { status: 404 });
    }

    (orders as Order[]).forEach((order: Order) => {
      if (typeof order.items === 'string') {
        order.items = JSON.parse(order.items);
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
