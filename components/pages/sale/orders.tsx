"use client";
import { Order } from "@/app/types/order";
import { RiEditFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import ui from "@/app/data/ui.json";

export default function Orders({ data, handler }: { data: any; handler: any }) {
  return (
    <div className="ordersBlock m-6 border border-zinc-200 dark:border-zinc-800 rounded-sm px-6">
      <div className="flex flex-col">
        <div className="flex text-left py-6 text-default dark:text-zinc-600 text-sm">
          <div className="w-[10%]">{ui.order.order_number}</div>
          <div className="flex-1">{ui.order.description}</div>
          <div className="w-[5%]">{ui.order.qty}</div>
          <div className="w-[10%]">{ui.order.price}</div>
          <div className="w-[5%]">{ui.order.discount}</div>
          <div className="w-[10%]">{ui.order.sum}</div>
          <div className="w-[4%]"></div>
        </div>
        {data.orders.map((order: Order) => (
          <div key={order.order_id} className="flex border-t border-zinc-200 dark:border-zinc-800 py-6 items-center">
            <div className="w-[10%]">
              {data.number}-{order.order_id}
            </div>
            <div className="flex-1">{order.description}</div>
            <div className="w-[5%]">{order.qty}</div>
            <div className="w-[10%]">
              {order.price.toLocaleString("uk-UA", {
                style: "currency",
                currency: "UAH",
              })}
            </div>
            <div className="w-[5%]">{order.order_dis}</div>
            <div className="w-[10%]">
              {order.order_sum.toLocaleString("uk-UA", {
                style: "currency",
                currency: "UAH",
              })}
            </div>
            <div className="w-[4%] flex">
              <Button className="ml-auto" variant={"outline"} onClick={() => handler(order.order_id)}>
                <RiEditFill />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
