"use client";
import { Item } from "@/app/types/Item";
import { RiEditFill, RiAddFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import ui from "@/app/data/ui.json";
import { Order } from "@/app/types/Order";
import { moneyFormat } from "@/lib/format";
import { itemNumbers, discountNumbers } from "@/lib/item-numbers";

export function Items({ data, handler }: { data: Order; handler: any }) {
  const columns = [
    "w-[6%] truncate",
    "flex-1",
    "w-[6%]",
    "w-[10%]",
    "w-[5%]",
    "w-[8%]",
    "w-[8%]",
    "w-[3%]",
  ];

  return data.items.length > 0 ? (
    <>
      <div className="ordersBlock m-6 border border-zinc-200 dark:border-zinc-800 rounded-sm px-6">
        <div className="flex flex-col">
          <div className="flex text-left py-6 text-default dark:text-zinc-600 text-sm">
            <div className={columns[0]}>{ui.order.order_number}</div>
            <div className={columns[1]}>{ui.order.description}</div>
            <div className={columns[3]}>{ui.order.price}</div>
            <div className={columns[4]}>{ui.order.discount}</div>
            <div className={columns[5]}>{ui.order.price_with_discount}</div>
            <div className={columns[2]}>{ui.order.qty}</div>
            <div className={columns[6]}>{ui.order.sum}</div>
            <div className={columns[7]}></div>
          </div>
          {data.items?.map((item: Item) => (
            <div
              key={item.id}
              className="flex border-t border-zinc-200 dark:border-zinc-800 py-6 items-center"
            >
              <div className={columns[0]}>
                {data.number}-{item.id}
              </div>
              <div className={columns[1]}>{item.description}</div>
              <div className={columns[3]}>{moneyFormat(item.price)}</div>
              <div className={columns[4]}>{Number(item.discount) * 100}%</div>
              <div className={columns[5]}>
                {discountNumbers(item).discountedPriceFormatted}
              </div>
              <div className={columns[2]}>{item.quantity}</div>
              <div className={columns[6]}>
                {itemNumbers(item).totalWithDiscountFormatted}
              </div>
              <div className={columns[7]}>
                <Button
                  className="ml-auto"
                  variant={"outline"}
                  onClick={() => handler(item.id)}
                >
                  <RiEditFill />
                </Button>
              </div>
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
