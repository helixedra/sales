"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Status from "@/components/shared/status";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signOut } from "next-auth/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ui from "@/app/data/ui.json";
import { PulseLoader } from "react-spinners";
import moment from "moment";

export default function Home() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch("/api/sales");
      const data = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
    setIsLoading(false);
  }, []);

  interface Status {
    name: string;
    bgColor: string;
    textColor: string;
  }

  const statuses: { [key: string]: Status } = {
    new: { name: ui.status.new, bgColor: "bg-purple-500", textColor: "text-purple-500" },
    prepay: { name: ui.status.prepay, bgColor: "bg-orange-500", textColor: "text-orange-500" },
    inprogress: { name: ui.status.inprogress, bgColor: "bg-blue-500", textColor: "text-blue-500" },
    finished: { name: ui.status.finished, bgColor: "bg-zinc-300", textColor: "text-zinc-300" },
    ready: { name: ui.status.ready, bgColor: "bg-green-500", textColor: "text-green-500" },
    canceled: { name: ui.status.canceled, bgColor: "bg-red-500", textColor: "text-red-500" },
  };

  interface Order {
    order_id: number;
    created: string;
    description: string;
    qty: number;
    price: number;
    order_sum: number;
    order_dis: number;
  }

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <PulseLoader />
        </div>
      )}

      <div className="TableContainer">
        <div className="TableHeader flex gap-4 py-2 px-4 justify-between items-center text-zinc-500 text-sm border-b border-zinc-100 font-[600] sticky top-0 z-10 bg-white">
          <div className="w-[5%] max-w-[60px] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.num}</div>
          <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.date}</div>
          <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.status}</div>
          <div className="w-[10%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.customer}</div>
          <div className="w-[35%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.order}</div>
          <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.total}</div>
          <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.left}</div>
          <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-nowrap">{ui.sales_table.deadline}</div>
          <div className="w-[5%] truncate whitespace-nowrap overflow-hidden text-center text-nowrap">{ui.sales_table.days_left}</div>
        </div>
        <div>
          {salesData.map((sale) => (
            <Link href={`/sales/${sale.id}`} key={sale.id}>
              <div className="TableRow flex gap-4 py-4 px-4 justify-between items-center border-b border-zinc-100 cursor-pointer hover:bg-zinc-100">
                <div className="w-[5%] max-w-[60px]">{sale.number}</div>
                <div className="w-[5%]">{moment(sale.date).format("DD.MM.YYYY")}</div>
                <div className="w-[5%] text-sm">
                  <Status bgColor={statuses[sale.status].bgColor} textColor={statuses[sale.status].textColor} name={statuses[sale.status].name} />
                </div>
                <div className="w-[10%] truncate whitespace-nowrap overflow-hidden text-nowrap">{sale.client}</div>
                <div className="w-[35%]">
                  <div className="flex items-center">
                    {sale.orders.map((order: Order) => (
                      <div key={order.order_id} className="px-2 py-1 rounded-md bg-zinc-200 text-sm mx-1 truncate whitespace-nowrap overflow-hidden" title={order.description}>
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
  );
}
