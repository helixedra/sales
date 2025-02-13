"use client";
import { useState, useEffect } from "react";

import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ui from "@/app/data/ui.json";
import statuses from "@/lib/status";
import { Button } from "@/components/ui/button";
import { RiBillLine, RiReceiptLine, RiMoneyDollarBoxLine, RiMessage2Fill, RiEditFill, RiCircleFill } from "react-icons/ri";

import moment from "moment";
import Loader from "@/components/shared/loader";
import SaleEditDialog from "./sale-edit-dialog";

export default function SalePage() {
  interface Sale {
    id: number;
    date: string;
    status: string;
    number: number;
    client: string;
    email: string;
    tel: string;
    address: string;
    delivery: string;
    deadline: number;
    prepay: number;
    comment: string;
    orders: Order[];
  }

  interface Order {
    order_id: number;
    created: string;
    description: string;
    qty: number;
    price: number;
    order_sum: number;
    order_dis: number;
  }

  const saleInitialState: Sale = {
    id: 0,
    date: "",
    status: "",
    number: 0,
    client: "",
    email: "",
    tel: "",
    address: "",
    delivery: "",
    deadline: 0,
    prepay: 0,
    comment: "",
    orders: [],
  };

  const params = useParams();
  const { slug } = params;
  const [salesData, setSalesData] = useState<Sale>(saleInitialState);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [saleEditDialog, setSaleEditDialog] = useState(false);

  function handleStatusChange(status: string) {
    setSelectedStatus(status);
    async function updateStatus() {
      try {
        const response = await fetch(`/api/sales/update/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, number: salesData.number }),
        });

        if (!response.ok) {
          throw new Error("Failed to update status");
        }

        // const result = await response.json();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }

    updateStatus();
  }

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch(`/api/sales/item/${slug}`);
      const data = await response.json();
      setSalesData(data);
      setIsLoading(false);
      setSelectedStatus(data.status);
    }

    fetchSalesData();
  }, [slug, selectedStatus]);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && salesData && (
        <>
          <div className="topBar flex p-6 items-center">
            <div className="text-4xl mr-6 pr-6 border-r border-1  border-gray-200 dark:border-zinc-700 border-solid">№ {salesData.number}</div>
            <div className={`status-${salesData.status} mr-4`}>
              <RiCircleFill />
            </div>
            <div className="ml-2">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] dark:bg-zinc-800 bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm p-2">
                  <SelectValue className={`status-${selectedStatus}`}>{statuses[selectedStatus]?.name || selectedStatus}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ui.status).map((status) => (
                    <SelectItem key={status} value={status} className={`status-${status}`}>
                      {statuses[status].name || status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="actionButtons ml-auto space-x-4">
              <Button>
                <RiReceiptLine />
                {ui.global.receipt}
              </Button>
              <Button>
                <RiBillLine />
                {ui.global.request_form}
              </Button>
              <Button>
                <RiMoneyDollarBoxLine />
                {ui.global.invoice}
              </Button>
            </div>
          </div>

          <div className="orderInfo justify-between border border-zinc-200 dark:border-zinc-800 rounded-sm px-6 m-6">
            <div className="grid grid-cols-11 divide-x-1 text-left py-4 text-default dark:text-zinc-600 text-sm gap-8 items-center ">
              <div className="truncate overflow-hidden">{ui.global.order_date}</div>
              <div className="col-span-2 truncate overflow-hidden">{ui.global.customer}</div>
              <div className="truncate overflow-hidden">{ui.global.phone}</div>
              <div className="truncate overflow-hidden">{ui.global.email}</div>
              <div className="col-span-2 truncate overflow-hidden">{ui.global.address}</div>
              <div className="truncate overflow-hidden">{ui.global.order_sum}</div>
              <div className="truncate overflow-hidden">{ui.global.paid}</div>
              <div className="truncate overflow-hidden">{ui.global.left}</div>
              <div className="truncate overflow-hidden flex items-center justify-between">
                {ui.global.deadline}
                <div>
                  <Button variant={"outline"} className="flex ml-auto text-black dark:text-white" onClick={() => setSaleEditDialog(true)}>
                    <RiEditFill />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-11 divide-x-1 text-left gap-8 py-6 border-t border-zinc-200 dark:border-zinc-800 divide-x">
              <div className="">{moment(salesData.date).format("DD.MM.YYYY")}</div>
              <div className="pl-4 break-all col-span-2">{salesData.client}</div>
              <div className="pl-4">{salesData.tel}</div>
              <div className="pl-4">{salesData.email}</div>
              <div className="col-span-2 pl-4">{salesData.address}</div>
              <div className="pl-4">
                {salesData.orders
                  .reduce((acc: number, order: Order) => acc + order.order_sum, 0)
                  .toLocaleString("uk-UA", {
                    style: "currency",
                    currency: "UAH",
                  })}
              </div>
              <div className="pl-4">
                {salesData.prepay.toLocaleString("uk-UA", {
                  style: "currency",
                  currency: "UAH",
                })}
              </div>
              <div className="pl-4">
                {(salesData.orders.reduce((acc: number, order: Order) => acc + order.order_sum, 0) - salesData.prepay).toLocaleString("uk-UA", {
                  style: "currency",
                  currency: "UAH",
                })}
              </div>
              <div className="pl-4">
                {moment(salesData.date).add(Number(salesData.deadline), "days").format("DD.MM.YYYY")} <span className="text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1 rounded-sm">{moment(salesData.date).add(Number(salesData.deadline), "days").diff(moment(), "days") < 0 && 0} </span>
              </div>
            </div>
          </div>

          {salesData.comment && (
            <div className="commentBlock p-6 bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-300 m-6 rounded-sm">
              <div className="relative">
                <div className="absolute top-1 left-0 text-orange-400 p-2 rounded-t-sm">
                  <RiMessage2Fill style={{ width: "24px", height: "24px" }} />
                </div>
                <div style={{ whiteSpace: "pre-line" }} className="pl-14">
                  {salesData.comment.replace(/\\r\\n/g, "\r\n")}
                </div>
              </div>
            </div>
          )}

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
              {salesData.orders.map((order) => (
                <div key={order.order_id} className="flex border-t border-zinc-200 dark:border-zinc-800 py-6 items-center">
                  <div className="w-[10%]">
                    {salesData.number}-{order.order_id}
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
                  <div className="w-[4%]">
                    <Button variant={"outline"}>
                      <RiEditFill />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SaleEditDialog dialog={saleEditDialog} trigger={setSaleEditDialog} data={salesData} />
        </>
      )}
    </div>
  );
}
