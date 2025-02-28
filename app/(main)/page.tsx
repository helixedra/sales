"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Order } from "@/app/types/order";
import { Sale } from "@/app/types/sale";
import statuses from "@/app/types/status";
import Status from "@/components/shared/status";
import Loader from "@/components/shared/loader";
import { TopBar } from "@/components/pages/homepage/topbar";
import ui from "@/app/data/ui.json";
import { orderDates } from "@/utils/order-dates";
import { orderTotal, orderLeft } from "@/utils/order-numbers";

// Styles
import "@/app/styles/homepage.css";

// Constants
const TABLE_HEADERS: { key: keyof typeof ui.sales_table; width: string }[] = [
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

// Table row component
const SaleRow = ({ sale }: { sale: Sale }) => {
  return (
    <Link href={`/orders/${sale.number}`} className="block">
      <div className={clsx({ "line-through opacity-30": sale.status === "canceled" }, "TableRow")}>
        <div className="w-[5%] max-w-[60px]">{sale.number}</div>
        <div className="w-[5%]">{orderDates(sale).dateLocal}</div>
        <div className="w-[5%] text-sm">
          <Status
            status={sale.status}
            name={statuses[sale.status].name}
            className="opacity-100 no-line-through"
          />
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
  );
};

// Table header component
const TableHeader = () => (
  <div className="TableHeader">
    {TABLE_HEADERS.map(({ key, width }) => (
      <div key={key} className={clsx(width, "cutLine")}>
        {ui.sales_table[key]}
      </div>
    ))}
  </div>
);

// Main page component
export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Getting data from API
  const { isLoading, data: salesData = [] } = useQuery<Sale[]>({
    queryKey: ["salesData"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/sales");
        return response.data;
      } catch (error) {
        console.error("Error fetching sales data:", error);
        throw new Error("Failed to fetch sales data");
      }
    },
  });

  // Getting new order number
  const newSaleNumber = useMemo(() => {
    return salesData.length > 0 ? salesData[0].number + 1 : 1;
  }, [salesData]);

  // Filtering data
  const filteredSales = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return salesData;

    const queryLower = trimmedQuery.toLowerCase();
    return salesData.filter(
      (sale: Sale) =>
        sale.client?.toLowerCase().includes(queryLower) ||
        sale.orders.some((order: Order) => order.description?.toLowerCase().includes(queryLower)) ||
        sale.number?.toString().includes(trimmedQuery)
    );
  }, [salesData, searchQuery]);

  // Search handler with debounce
  const searchHandler = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(query);
    }, 300);
  }, []);

  // Clear timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Loader
  if (isLoading) return <Loader />;

  return (
    <main>
      <TopBar newSaleNumber={newSaleNumber} searchHandler={searchHandler} />

      <div className="TableContainer p-4">
        <TableHeader />

        <div className="TableBody">
          {filteredSales.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {ui.global.nothing_found} "{searchQuery}"
            </div>
          ) : (
            filteredSales.map((sale) => <SaleRow key={sale.id} sale={sale} />)
          )}
        </div>
      </div>
    </main>
  );
}
