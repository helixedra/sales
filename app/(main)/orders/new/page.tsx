"use client";
import { Suspense } from "react";
import NewSaleContent from "./NewSaleContent";
import Loader from "@/components/shared/loader";

export default function NewSale() {
  return (
    <Suspense fallback={<Loader />}>
      <NewSaleContent />
    </Suspense>
  );
}
