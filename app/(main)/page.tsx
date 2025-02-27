"use client";
import axios from "axios";
import { Order } from "@/app/types/order";
import { Sale } from "@/app/types/sale";
import Status from "@/components/shared/status";
import statuses from "@/app/types/status";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import Link from "next/link";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/pages/homepage/topbar";
import { useState, useEffect, useRef, useCallback } from "react";
import { moneyFormat } from "@/lib/format";
import clsx from "clsx";
import "@/app/styles/homepage.css";

export default function Home() {
  // const router = useRouter();
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isLoading,
    data: data = [],
    // error,
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

  // Calculate the total amount
  const orderTotal = (sale: Sale) => {
    const number = sale.orders.reduce((acc, order) => acc + order.order_sum, 0);
    return { number, currencyString: moneyFormat(number) };
  };

  // Calculate the remaining amount to be paid
  const orderLeft = (sale: Sale) => {
    const total = orderTotal(sale).number;
    const number = total - sale.prepay;
    return { number, currencyString: moneyFormat(number) };
  };

  // Calculate the deadline date
  const orderDates = (sale: Sale) => {
    const date = moment(sale.date);
    const dateLocal = date.format("DD.MM.YYYY");
    const deadlineDate = moment(sale.date).add(Number(sale.deadline), "days");
    const deadlineLocalDate = deadlineDate.format("DD.MM.YYYY");
    const deadlineDaysDiff = deadlineDate.diff(moment(), "days");
    const deadlineDaysLeft = deadlineDaysDiff < 0 ? 0 : deadlineDaysDiff;
    return { date, dateLocal, deadlineDate, deadlineDaysLeft, deadlineLocalDate };
  };

  const headers: { key: keyof typeof ui.sales_table; width: string }[] = [
    { key: "num", width: "w-[5%] max-w-[60px]" },
    { key: "date", width: "w-[5%]" },
    { key: "status", width: "w-[5%]" },
    { key: "customer", width: "w-[10%]" },
    { key: "order", width: "w-[35%]" },
    { key: "total", width: "w-[5%]" },
    { key: "left", width: "w-[5%]" },
    { key: "deadline", width: "w-[5%]" },
    { key: "days_left", width: "w-[5%] text-center" },
  ];

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && salesData && (
        <>
          <TopBar newSaleNumber={newSaleNumber} searchHandler={searchHandler} />

          <div className="TableContainer p-4">
            <div className="TableHeader">
              {headers.map(({ key, width }) => (
                <div key={key} className={clsx(width, "cutLine")}>
                  {ui.sales_table[key]}
                </div>
              ))}
            </div>

            <div>
              {salesData.map((sale) => (
                <Link key={sale.id} href={`/sales/${sale.number}`} className="block">
                  <div className="TableRow">
                    <div className="w-[5%] max-w-[60px]">{sale.number}</div>
                    <div className="w-[5%]">{orderDates(sale).dateLocal}</div>
                    <div className="w-[5%] text-sm">
                      <Status status={sale.status} name={statuses[sale.status].name} />
                    </div>
                    <div className="w-[10%] cutLine">{sale.client}</div>
                    <div className="w-[35%] flex items-center">
                      {sale.orders.map((order) => (
                        <div key={order.order_id} className="OrderItem" title={order.description}>
                          {order.description}
                        </div>
                      ))}
                    </div>
                    <div className="w-[5%]">{orderTotal(sale).currencyString}</div>
                    <div className="w-[5%]">{orderLeft(sale).currencyString}</div>
                    <div className="w-[5%]">{orderDates(sale).deadlineLocalDate}</div>
                    <div className="w-[5%] text-center">{orderDates(sale).deadlineDaysLeft}</div>
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
