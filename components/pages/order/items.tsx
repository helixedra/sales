"use client";
import { Item } from "@/app/types/Item";
import { RiEditFill, RiAddFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import ui from "@/app/data/ui.json";
import { Order } from "@/app/types/Order";
import { moneyFormat } from "@/lib/format";
import { itemNumbers, discountNumbers } from "@/lib/item-numbers";

const columns = [
  `w-full lg:w-[100px] lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:flex-1 lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:w-[150px] lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:w-[70px] lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:w-[150px] lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:w-[60px] lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:w-[100px] lg:p-2 lg:border-r lg:flex lg:items-center border-zinc-200 dark:border-zinc-800`,
  `w-full lg:w-[50px] lg:p-2 lg:flex lg:items-center  border-zinc-200 dark:border-zinc-800`,
];

export function Items({ data, handler }: { data: Order; handler: any }) {
  return data.items.length > 0 ? (
    <>
      <div className="ordersBlock m-4 border-0 lg:border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm">
        <div className="flex flex-col gap-4 lg:gap-0">
          <TableHeader className="hidden lg:flex" />
          {data.items?.map((item: Item) => (
            <div
              key={item.id}
              className="flex flex-col lg:flex-row border lg:border-0 rounded-sm lg:rounded-none lg:border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              <Cell
                label={ui.order.order_number}
                data={`${data.number}-${item.id}`}
                width={columns[0]}
              />
              <Cell
                label={ui.order.description}
                data={item.description}
                width={columns[1]}
              />
              <Cell
                label={ui.order.price}
                data={moneyFormat(item.price)}
                width={columns[2]}
              />
              <Cell
                label={ui.order.discount}
                data={`${Number(item.discount) * 100}%`}
                width={columns[3]}
              />
              <Cell
                label={ui.order.price_with_discount}
                data={discountNumbers(item).discountedPriceFormatted}
                width={columns[4]}
              />
              <Cell
                label={ui.order.qty}
                data={item.quantity.toString()}
                width={columns[5]}
              />
              <Cell
                label={ui.order.sum}
                data={itemNumbers(item).totalWithDiscountFormatted}
                width={columns[6]}
              />
              <Cell
                label={ui.order.sum}
                data={
                  <button
                    className="w-8 h-8 cursor-pointer hover:opacity-50 flex items-center justify-center"
                    onClick={() => handler(item.id)}
                  >
                    <RiEditFill />
                  </button>
                }
                width={columns[7]}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="m-6">
        <AddOrder handler={handler} />
      </div>
    </>
  ) : (
    <div className="m-6">
      <AddOrder handler={handler} />
    </div>
  );
}

export function AddOrder({ handler }: { handler: (orderId: number) => void }) {
  return (
    <>
      <Button className="ml-auto" onClick={() => handler(0)}>
        <RiAddFill /> {ui.global.add_item}
      </Button>
    </>
  );
}

export function TableHeader({ className }: { className?: string }) {
  return (
    <div className={`flex dark:text-zinc-600 ${className}`}>
      <div className={`${columns[0]} truncate`}>{ui.order.order_number}</div>
      <div className={`${columns[1]} truncate`}>{ui.order.description}</div>
      <div className={`${columns[2]} truncate`}>{ui.order.price}</div>
      <div className={`${columns[3]} truncate`}>{ui.order.discount}</div>
      <div className={`${columns[4]} truncate`}>
        {ui.order.price_with_discount}
      </div>
      <div className={`${columns[5]} truncate`}>{ui.order.qty}</div>
      <div className={`${columns[6]}`}>{ui.order.sum}</div>
      <div className={columns[7]}></div>
    </div>
  );
}

export function Cell({
  label,
  data,
  width,
}: {
  label: string;
  data: string | any;
  width: string;
}) {
  return (
    <div className={`${width} p-4`}>
      <div className={`block lg:hidden text-zinc-500 mb-2`}>{label}</div>
      <div className="p-1">{data}</div>
    </div>
  );
}
