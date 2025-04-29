"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  RiBillLine,
  RiReceiptLine,
  RiMoneyDollarBoxLine,
  RiChatNewLine,
  RiUploadCloud2Line,
  RiCircleFill,
} from "react-icons/ri";
import moment from "moment";
import ui from "@/app/data/ui.json";
import statuses from "@/lib/status";
import { Order } from "@/app/types/Order";

type Props = {
  data: Order;
  commentDialog: () => void;
  uploadDialog: () => void;
  handleStatusChange: (status: string) => void;
  invoiceDialog: () => void;
  receiptDialog: () => void;
  requestFormDialog: () => void;
};

export function TopBar({
  data,
  commentDialog,
  uploadDialog,
  handleStatusChange,
  invoiceDialog,
  receiptDialog,
  requestFormDialog,
}: Props) {
  const date = moment(data.date).format("DD.MM.YYYY");
  return (
    <div className="flex gap-4 flex-col md:flex-row p-6 items-start md:items-center border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center text-4xl border-1 border-gray-200 dark:border-zinc-700 border-solid">
          <div className="mr-4 text-2xl text-nowrap font-bold">
            № {data.number}
          </div>
          <div className="text-lg opacity-50 text-nowrap">від {date}</div>
        </div>

        <div className="flex items-center">
          <div className={`status-${data.status} mr-4`}>
            <RiCircleFill />
          </div>
          <div className="ml-2">
            <Select value={data.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] dark:bg-zinc-800 bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm p-2">
                <SelectValue className={`status-${data.status}`}>
                  {statuses[data.status]?.name || data.status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(ui.status).map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className={`status-${status}`}
                  >
                    {statuses[status].name || status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="actionButtons md:ml-auto space-x-4 flex items-center">
        {!data.comment && (
          <Button
            onClick={commentDialog}
            variant="outline"
            title={ui.global.add_comment}
            className="w-full md:min-w-[60px] xl:w-fit border border-solid text-orange-500 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-white"
          >
            <RiChatNewLine />
            <span className="hidden xl:block">{ui.global.add_comment}</span>
          </Button>
        )}
        <Button
          onClick={uploadDialog}
          title={ui.global.upload_files}
          className="w-full md:min-w-[60px] xl:w-fit"
        >
          <RiUploadCloud2Line />
          <span className="hidden xl:block">{ui.global.upload_files}</span>
        </Button>
        <Button
          onClick={receiptDialog}
          title={ui.global.receipt}
          className="w-full md:min-w-[60px] xl:w-fit"
        >
          <RiReceiptLine />
          <span className="hidden xl:block">{ui.global.receipt}</span>
        </Button>
        <Button
          onClick={requestFormDialog}
          title={ui.global.request_form}
          className="w-full md:min-w-[60px] xl:w-fit"
        >
          <RiBillLine />
          <span className="hidden xl:block">{ui.global.request_form}</span>
        </Button>
        <Button
          onClick={invoiceDialog}
          title={ui.global.invoice}
          className="w-full md:min-w-[60px] xl:w-fit"
        >
          <RiMoneyDollarBoxLine />
          <span className="hidden xl:block">{ui.global.invoice}</span>
        </Button>
      </div>
    </div>
  );
}
