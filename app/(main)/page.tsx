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

export default function Home() {
  const [salesData, setSalesData] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch("/api/sales");
      const data = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
  }, []);

  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: "/login" });
  }

  interface Status {
    name: string;
    bgColor: string;
    textColor: string;
  }

  const statuses: { [key: string]: Status } = {
    new: { name: ui.status.new, bgColor: "bg-zinc-100", textColor: "text-zinc-500" },
    prepay: { name: ui.status.prepay, bgColor: "bg-orange-500", textColor: "text-orange-500" },
    inprogress: { name: ui.status.inprogress, bgColor: "bg-blue-500", textColor: "text-blue-500" },
    finished: { name: ui.status.finished, bgColor: "bg-zinc-300", textColor: "text-zinc-300" },
    ready: { name: ui.status.ready, bgColor: "bg-green-500", textColor: "text-green-500" },
    canceled: { name: ui.status.canceled, bgColor: "bg-red-500", textColor: "text-red-500" },
  };

  return (
    <>
      <Table>
        <TableCaption>Sales Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Num</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.map((sale) => (
            <TableRow onClick={() => router.push(`/sales/${sale.id}`)} key={sale.id} className=" cursor-pointer hover:bg-gray-100 align-middle">
              <TableCell>{sale.number}</TableCell>
              <TableCell className="font-semibold">
                <Status bgColor={statuses[sale.status].bgColor} textColor={statuses[sale.status].textColor} name={statuses[sale.status].name} />
              </TableCell>
              <TableCell>{sale.date}</TableCell>
              <TableCell>{sale.client}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
