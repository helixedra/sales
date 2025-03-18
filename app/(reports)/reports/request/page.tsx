import ReportLayout from "../../layout";
import { RequestFormContent } from "./request-content";

export default async function RequestFormPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // Access query parameters from searchParams
  const { number, supplier, date } = await searchParams;
  return (
    <ReportLayout>
      <RequestFormContent number={number} supplier={supplier} date={date} />
    </ReportLayout>
  );
}
