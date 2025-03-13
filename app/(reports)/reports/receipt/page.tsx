import ReceiptLayout from "../../layout"
import { ReceiptContent } from "./receipt-content"



export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Access query parameters from searchParams
  const {number, suppliers, date} = await searchParams
  return (
    <ReceiptLayout>
      <ReceiptContent number={number} suppliers={suppliers} date={date} />
    </ReceiptLayout>
  )
}

