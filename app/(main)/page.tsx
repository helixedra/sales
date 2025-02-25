"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Order } from "@/app/types/order";
import { Sale } from "@/app/types/sale";
import Status from "@/components/shared/status";
import { Input } from "@/components/ui/input";
import { RiSearchLine, RiAddFill } from "react-icons/ri";
import statuses from "@/app/types/status";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import Link from "next/link";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/pages/homepage/topbar";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const router = useRouter();
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isLoading,
    data: data = [],
    error,
  } = useQuery<Sale[]>({
    queryKey: ["salesData"],
    queryFn: async () => {
      const response = await axios.get("/api/sales");
      if (response.status !== 200) {
        throw new Error("Failed to fetch sales data");
      }
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setSalesData(data);
    }
  }, [!isLoading]);

  const newSaleNumber = salesData.length > 0 ? salesData[0].number + 1 : 1;

  // The actual search logic
  const performSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === "") {
        setSalesData(data);
        return;
      }

      const queryLower = trimmedQuery.toLowerCase();

      const filteredSales = data.filter((sale: Sale) => {
        const clientMatch = sale.client?.toLowerCase().includes(queryLower) || false;
        const orderMatch = sale.orders.some((order: Order) => order.description?.toLowerCase().includes(queryLower) || false);
        const numberMatch = sale.number?.toString().includes(trimmedQuery) || false;

        return clientMatch || orderMatch || numberMatch;
      });

      setSalesData(filteredSales);
    },
    [data]
  );

  // The debounced search handler
  function searchHandler(query: string) {
    setSearchQuery(query);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }

  // Clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && salesData && (
        <>
          <TopBar newSaleNumber={newSaleNumber} searchHandler={searchHandler} />

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
              {salesData.map((sale: Sale) => (
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
                    <div className="w-[5%] text-center">{moment(sale.date).add(Number(sale.deadline), "days").diff(moment(), "days") < 0 ? 0 : moment(sale.date).add(Number(sale.deadline), "days").diff(moment(), "days")}</div>
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
