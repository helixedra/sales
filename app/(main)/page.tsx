'use client';
import { useState, useEffect, useRef, useCallback, useMemo, use } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Order } from '@/app/types/order';
import { Sale } from '@/app/types/sale';
import statuses from '@/app/types/status';
import Status from '@/components/shared/status';
import Loader from '@/components/shared/loader';
import { TopBar } from '@/components/pages/homepage/topbar';
import ui from '@/app/data/ui.json';
import { orderDates } from '@/utils/order-dates';
import { orderTotal, orderLeft } from '@/utils/order-numbers';
import { useAllOrdersData } from '@/hooks/api/useOrderData';

// Styles
import '@/app/styles/homepage.css';

// Constants
const TABLE_HEADERS: { key: keyof typeof ui.sales_table; width: string }[] = [
  { key: 'num', width: 'w-[5%] max-w-[60px]' },
  { key: 'date', width: 'w-[5%]' },
  { key: 'status', width: 'w-[5%]' },
  { key: 'customer', width: 'w-[10%]' },
  { key: 'order', width: 'w-[35%]' },
  { key: 'total', width: 'w-[5%]' },
  { key: 'left', width: 'w-[5%]' },
  { key: 'deadline', width: 'w-[5%]' },
  { key: 'days_left', width: 'w-[5%] text-center' },
];

const stylingCancel = (status: string) =>
  clsx({
    'line-through opacity-40': status === 'canceled',
  });

// Table row component
const SaleRow = ({ sale }: { sale: Sale }) => {
  return (
    <Link href={`/orders/${sale.number}`} className="block">
      <div className="TableRow">
        <div className={`w-[5%] max-w-[60px] ${stylingCancel(sale.status)}`}>
          {sale.number}
        </div>
        <div className={`w-[5%] ${stylingCancel(sale.status)}`}>
          {orderDates(sale).dateLocal}
        </div>
        <div className="w-[5%] text-sm">
          <Status
            status={sale.status}
            name={statuses[sale.status].name}
            className="opacity-100 no-line-through"
          />
        </div>
        <div className={`w-[10%] cutLine ${stylingCancel(sale.status)}`}>
          {sale.client}
        </div>
        <div
          className={`w-[35%] flex items-center ${stylingCancel(sale.status)}`}>
          {sale.orders.map((order) => (
            <div
              key={order.order_id}
              className="OrderItem"
              title={order.description}>
              {order.description}
            </div>
          ))}
        </div>
        <div className={`w-[5%] ${stylingCancel(sale.status)}`}>
          {orderTotal(sale).currencyString}
        </div>
        <div className={`w-[5%] ${stylingCancel(sale.status)}`}>
          {orderLeft(sale).currencyString}
        </div>
        <div className={`w-[5%] ${stylingCancel(sale.status)}`}>
          {orderDates(sale).deadlineLocalDate}
        </div>
        <div className={`w-[5%] text-center ${stylingCancel(sale.status)}`}>
          {orderDates(sale).deadlineDaysLeft}
        </div>
      </div>
    </Link>
  );
};

// Table header component
const TableHeader = () => (
  <div className="TableHeader">
    {TABLE_HEADERS.map(({ key, width }) => (
      <div key={key} className={clsx(width, 'cutLine')}>
        {ui.sales_table[key]}
      </div>
    ))}
  </div>
);

// Main page component
export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Getting data from API
  const { isLoading, data: orders } = useAllOrdersData();

  // Filtering data
  const filteredSales = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return orders;

    const queryLower = trimmedQuery.toLowerCase();
    return orders.filter(
      (sale: Sale) =>
        sale.client?.toLowerCase().includes(queryLower) ||
        sale.orders.some((order: Order) =>
          order.description?.toLowerCase().includes(queryLower)
        ) ||
        sale.number?.toString().includes(trimmedQuery)
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

  // Loader
  if (isLoading) return <Loader />;

  // Getting new order number
  const newSaleNumber = orders && orders.length > 0 ? orders[0].number + 1 : 1;

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
            filteredSales.map((sale: Sale) => (
              <SaleRow key={sale.id} sale={sale} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
