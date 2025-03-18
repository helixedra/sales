import ReportLayout from "../../layout";
import { ReceiptContent } from "./receipt-content";

export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // Access query parameters from searchParams
  const { number, supplier, date } = await searchParams;
  return (
    <ReportLayout>
      <ReceiptContent number={number} supplier={supplier} date={date} />
    </ReportLayout>
  );
}
