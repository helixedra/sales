import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET(
  request: Request,
  { params }: { params: { number: string } }
) {
  const { number } = await params;

  if (!number) {
    return NextResponse.json(
      { error: 'Sale number is required' },
      { status: 400 }
    );
  }

  try {
    const order = db
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
            WHEN COUNT(items.id) = 0 THEN '[]'
            ELSE json_group_array(
              json_object(
                'id', items.id,
                'created', items.created,
                'description', items.description,
                'quantity', items.quantity,
                'price', items.price,
                'total', items.total,
                'discount', items.discount
              )
            )
          END AS items
        FROM
          sales
        LEFT JOIN
          items ON sales.number = items.order_number
        WHERE
          sales.number = ?
        GROUP BY
          sales.id, sales.date, sales.status, sales.number, sales.client, sales.email, sales.tel, 
          sales.address, sales.delivery, sales.deadline, sales.prepay, sales.comment`
      )
      .get(number);

    if (!order) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    // If items is returned as a JSON string, parse it
    if (typeof (order as any).items === 'string') {
      (order as any).items = JSON.parse((order as any).items);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
