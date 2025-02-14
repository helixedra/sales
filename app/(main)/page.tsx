"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";
import { Sale } from "@/interfaces/sale";
import Status from "@/components/shared/status";
import { Input } from "@/components/ui/input";
import { RiSearchLine, RiAddFill } from "react-icons/ri";
import statuses from "@/lib/status";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import Link from "next/link";
import moment from "moment";

export default function Home() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  async function fetchSalesData() {
    setIsLoading(true);
    const response = await fetch("/api/sales");
    const data = await response.json();
    setSalesData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && salesData && (
        <>
          <div className="topBar flex items-center p-6">
            <Button variant="default" onClick={() => router.push("/sales/new")}>
              <RiAddFill style={{ width: "24px", height: "24px" }} />
              {ui.global.add_new}
            </Button>

            <div className="relative flex-1 ml-auto max-w-[300px]">
              <RiSearchLine className="absolute left-3 top-3 h-4 w-4 text-zinc-400 " style={{ width: "16px", height: "16px" }} />
              <Input type="search" placeholder="Search..." className="pl-10 pr-4 dark:bg-zinc-800 bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm" />
            </div>
          </div>

          <div className="TableContainer p-4">
            <div className="TableHeader flex gap-4 py-2 px-4 justify-between items-center text-zinc-500 text-sm border-b border-zinc-100 dark:border-zinc-800 font-[600] sticky top-0 z-10">
              <div className="w-[5%] max-w-[60px] cutLine">{ui.sales_table.num}</div>
              <div className="w-[5%] cutLine">{ui.sales_table.date}</div>
              <div className="w-[5%] cutLine">{ui.sales_table.status}</div>
              <div className="w-[10%] cutLine">{ui.sales_table.customer}</div>
              <div className="w-[35%] cutLine">{ui.sales_table.order}</div>
              <div className="w-[5%] cutLine">{ui.sales_table.total}</div>
              <div className="w-[5%] cutLine">{ui.sales_table.left}</div>
              <div className="w-[5%] cutLine">{ui.sales_table.deadline}</div>
              <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-center text-nowrap">{ui.sales_table.days_left}</div>
            </div>
            <div>
              {salesData.map((sale) => (
                <Link href={`/sales/${sale.number}`} key={sale.id}>
                  <div className="TableRow flex gap-4 py-4 px-4 justify-between items-center border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <div className="w-[5%] max-w-[60px]">{sale.number}</div>
                    <div className="w-[5%]">{moment(sale.date).format("DD.MM.YYYY")}</div>
                    <div className="w-[5%] text-sm">
                      <Status status={sale.status} name={statuses[sale.status].name} />
                    </div>
                    <div className="w-[10%] cutLine">{sale.client}</div>
                    <div className="w-[35%]">
                      <div className="flex items-center">
                        {sale.orders.map((order: Order) => (
                          <div key={order.order_id} className="px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-sm mx-1 truncate whitespace-nowrap overflow-hidden" title={order.description}>
                            {order.description}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-[5%]">
                      {sale.orders
                        .reduce((acc: number, order: Order) => acc + order.order_sum, 0)
                        .toLocaleString("uk-UA", {
                          style: "currency",
                          currency: "UAH",
                        })}
                    </div>
                    <div className="w-[5%]">
                      {(sale.orders.reduce((acc: number, order: Order) => acc + order.order_sum, 0) - sale.prepay).toLocaleString("uk-UA", {
                        style: "currency",
                        currency: "UAH",
                      })}
                    </div>
                    <div className="w-[5%]">{moment(sale.date).add(Number(sale.deadline), "days").format("DD.MM.YYYY")}</div>
                    <div className="w-[5%] text-center">{moment(sale.date).add(Number(sale.deadline), "days").diff(moment(), "days") < 0 && 0}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
