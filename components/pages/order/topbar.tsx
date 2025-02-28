"use client";
import { useState } from "react";
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
import statuses from "@/app/types/status";

export function TopBar({ salesData, setCommentDialog, setUploadDialog, handleStatusChange }) {
  const date = moment(salesData.date).format("DD.MM.YYYY");
  return (
    <div className="topBar flex p-6 items-center">
      <div className="flex items-center text-4xl mr-6 pr-6 border-r border-1  border-gray-200 dark:border-zinc-700 border-solid">
        <div className="mr-4">№ {salesData.number}</div>
        <div className="text-xl opacity-50">від {date}</div>
      </div>
      <div className={`status-${salesData.status} mr-4`}>
        <RiCircleFill />
      </div>
      <div className="ml-2">
        <Select value={salesData.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px] dark:bg-zinc-800 bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm p-2">
            <SelectValue className={`status-${salesData.status}`}>
              {statuses[salesData.status]?.name || salesData.status}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ui.status).map((status) => (
              <SelectItem key={status} value={status} className={`status-${status}`}>
                {statuses[status].name || status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="actionButtons ml-auto space-x-4">
        {!salesData.comment && (
          <Button
            onClick={() => setCommentDialog(true)}
            variant="outline"
            className="border border-solid text-orange-500 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-white"
          >
            <RiChatNewLine />
            {ui.global.add_comment}
          </Button>
        )}
        <Button onClick={() => setUploadDialog(true)}>
          <RiUploadCloud2Line />
          {ui.global.uplod_files}
        </Button>
        <Button>
          <RiReceiptLine />
          {ui.global.receipt}
        </Button>
        <Button>
          <RiBillLine />
          {ui.global.request_form}
        </Button>
        <Button>
          <RiMoneyDollarBoxLine />
          {ui.global.invoice}
        </Button>
      </div>
    </div>
  );
}
