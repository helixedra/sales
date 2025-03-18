import ReportLayout from "../../layout";
import { InvoiceContent } from "./invoice-content";

import ui from "@/app/data/ui.json";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { number, date } = await searchParams;
  return {
    title: `${ui.global.invoice} ${ui.global.num} ${number} ${ui.global.from} ${date}`,
  };
}

export default async function InvoicePage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { number, supplier, date } = await searchParams;

  return (
    <ReportLayout>
      <InvoiceContent number={number} supplier={supplier} date={date} />
    </ReportLayout>
  );
}
