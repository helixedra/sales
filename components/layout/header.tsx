"use client";
import Link from "next/link";
import { RiBox3Fill, RiBarChart2Fill, RiHome6Fill, RiLogoutBoxRFill } from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";
import styles from "./header.module.scss";
import { signOut } from "next-auth/react";
import ui from "@/app/data/ui.json";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: "/login" });
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={pathname === "/" ? buttonVariants({ variant: "link" }) + ` ${styles.active}` : buttonVariants({ variant: "link" })}>
        <RiBox3Fill style={{ width: "24px", height: "24px" }} /> {ui.mainmenu.sales}
      </Link>
      <Link href="/analytics" className={buttonVariants({ variant: "link" })}>
        <RiBarChart2Fill style={{ width: "24px", height: "24px" }} /> {ui.mainmenu.analytics}
      </Link>
      <Link href="/warehouse" className={buttonVariants({ variant: "link" })}>
        <RiHome6Fill style={{ width: "24px", height: "24px" }} /> {ui.mainmenu.warehouse}
      </Link>
      <Button variant={"link"} onClick={() => handleLogout()} className={styles.logout}>
        <RiLogoutBoxRFill style={{ width: "24px", height: "24px" }} />
      </Button>
    </header>
  );
}
