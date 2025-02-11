"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signOut } from "next-auth/react";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState<string>("");

  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: "/login" });
  }

  return (
    <>
      <Button variant="default" onClick={() => alert(`Selected value: ${selectedValue}`)}>
        Button
      </Button>
      <Link href="/cd" className={buttonVariants({ variant: "outline" })}>
        Click here
      </Link>
      <Select onValueChange={(value: string) => setSelectedValue(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="default" onClick={() => handleLogout()}>
        Log Out
      </Button>

      <div>
        <ul>
          <li>
            <a href="/api/users">USERS API</a>
          </li>
          <li>
            <a href="/api/sales">SALES API</a>
          </li>
          <li>
            <a href="/api/orders">ORDERS API</a>
          </li>
        </ul>
      </div>
    </>
  );
}
