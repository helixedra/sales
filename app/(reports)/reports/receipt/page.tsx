import ReportLayout from "../../layout";
import { ReceiptContent } from "./receipt-content";
import ui from "@/app/data/ui.json";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { number, date } = await searchParams;
  return {
    title: `${ui.global.receipt} ${ui.global.num} ${number} ${ui.global.from} ${date}`,
  };
}

export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // Access query parameters from searchParams
  const { number, supplier, date, signature } = await searchParams;
  return (
    <ReportLayout>
      <ReceiptContent
        number={number}
        supplier={supplier}
        date={date}
        signature={signature === "true"}
      />
    </ReportLayout>
  );
}
