"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Item } from "@/app/types/Item";
import { Order } from "@/app/types/Order";
import Loader from "@/components/shared/loader";
import { TopBar } from "@/components/pages/homepage/topbar";
import { useAllOrdersData } from "@/hooks/api/useOrderData";
import ui from "@/app/data/ui.json";
import { TABLE } from "@/components/pages/homepage/constants";
import {
  TABLE_ROW_STYLES,
  TABLE_HEADER_STYLES,
} from "@/components/pages/homepage/constants";

// Styles
import "@/app/styles/homepage.css";
import OrderItem from "@/components/pages/homepage/OrderItem";

// Table row component
const OrderRow = ({ order }: { order: Order }) => {
  return (
    <Link href={`/orders/${order.number}`} className="block">
      <OrderItem order={order} />
    </Link>
  );
};

// Table header component
const TableHeader = () => (
  <div className={TABLE_HEADER_STYLES}>
    {TABLE.map(({ key, width }) => (
      <div key={key} className={clsx(width, "cutLine")}>
        {ui.sales_table[key]}
      </div>
    ))}
  </div>
);

// Main page component
export default function OrdersPage() {
  // State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Getting data from API
  const { isLoading, data: orders } = useAllOrdersData();

  // Filtering data
  const filteredOrders = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return orders;

    const queryLower = trimmedQuery.toLowerCase();
    return orders?.filter(
      (order: Order) =>
        order.client?.toLowerCase().includes(queryLower) ||
        order.items.some((item: Item) =>
          item.description?.toLowerCase().includes(queryLower)
        ) ||
        order.number?.toString().includes(trimmedQuery)
    );
  }, [orders, searchQuery]);

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

  // Page title
  useEffect(() => {
    document.title = ui.pages.orders + " - " + ui.pages.site_name;
  }, []);

  // Loader
  if (isLoading) return <Loader />;

  // Getting new order number
  const newSaleNumber = orders && orders.length > 0 ? orders[0].number + 1 : 1;

  return (
    <main>
      <TopBar newSaleNumber={newSaleNumber} searchHandler={searchHandler} />

      <div className="TableContainer p-0 lg:p-4">
        <TableHeader />

        <div className="TableBody">
          {filteredOrders?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {ui.global.nothing_found}{" "}
              {searchQuery !== "" ? `"${searchQuery}"` : ""}
            </div>
          ) : (
            filteredOrders?.map((order: Order) => (
              <OrderRow key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
