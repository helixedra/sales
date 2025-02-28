"use client";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import ui from "@/app/data/ui.json";
import { Order } from "@/app/types/item";

export default function Analytics() {
  // Fetch data from the API
  const {
    isLoading,
    isError,
    error,
    data: ordersData,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      return res.data;
    },
    initialData: [],
  });

  // Calculate totals and metrics from data
  const calculateMetrics = (ordersData: Order[]) => {
    // Calculate total
    const total = ordersData.reduce((acc, value) => {
      return acc + (value.price * value.qty - value.price * value.qty * value.order_dis);
    }, 0);

    // Calculate total quantity
    const qty = ordersData.reduce((acc, value) => {
      return acc + value.qty;
    }, 0);

    // Calculate average
    const average = Math.round(total / qty);

    return { total, qty, average };
  };

  // Group data by year
  const groupByYear = (ordersData: Order[]) => {
    const sorted: { [key: number]: Order[] } = {};
    ordersData.forEach((order) => {
      const year = new Date(order.created).getFullYear();
      if (!sorted[year]) {
        sorted[year] = [];
      }
      sorted[year].push(order);
    });
    return sorted;
  };

  // Calculate gross for a specific year's data
  const calculateGross = (yearData: Order[]) => {
    return yearData.reduce((acc: number, value: Order) => {
      return acc + (value.price * value.qty - value.price * value.qty * value.order_dis);
    }, 0);
  };

  const { total, qty, average } = calculateMetrics(ordersData);
  const sortedByYear = groupByYear(ordersData);

  // Format number with commas and decimal points
  const formatNumber = (number: number) => {
    return number.toLocaleString("uk-UA", { style: "currency", currency: "UAH" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-around items-end mb-8 h-72">
          {Object.entries(sortedByYear).map(([year, yearData]) => {
            const amount = calculateGross(yearData);
            // Calculate height based on amount, with a minimum height
            const barHeight = Math.max(5, amount / 10000);

            return (
              <div key={year} className="flex flex-col items-center mx-4">
                <div className="font-bold mb-2">{year}</div>
                <div
                  className="w-12 bg-black dark:bg-zinc-400 mb-2 transition-all duration-500"
                  style={{ height: `${barHeight}px` }}
                ></div>
                <div className="text-sm">{formatNumber(amount)}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-zinc-400 border-opacity-20 rounded-lg p-6">
            <div className="text-gray-600 mb-2">{ui.global.total_turnover}</div>
            <div className="text-xl font-bold">{formatNumber(total)}</div>
          </div>
          <div className="border border-zinc-400 border-opacity-20 rounded-lg p-6">
            <div className="text-gray-600 mb-2">{ui.global.total_units}</div>
            <div className="text-xl font-bold">{qty} шт.</div>
          </div>
          <div className="border border-zinc-400 border-opacity-20 rounded-lg p-6">
            <div className="text-gray-600 mb-2">{ui.global.average_check}</div>
            <div className="text-xl font-bold">{formatNumber(average)}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
