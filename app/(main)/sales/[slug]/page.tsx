"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ui from "@/app/data/ui.json";
import statuses from "@/app/types/status";
import { Button } from "@/components/ui/button";
import { RiBillLine, RiReceiptLine, RiMoneyDollarBoxLine, RiMessage2Fill, RiEditFill, RiCircleFill, RiChatNewLine, RiUploadCloud2Line, RiFileLine } from "react-icons/ri";
import moment from "moment";
import Loader from "@/components/shared/loader";
import SaleEditDialog from "./sale-edit-dialog";
import { Sale } from "@/app/types/sale";
import { Order } from "@/app/types/order";
import OrderEditDialog from "./order-edit-dialog";
import CommentDialog from "./comment-dialog";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UploadDialog from "./upload-dialog";

export default function SalePage() {
  const queryClient = useQueryClient();

  const params = useParams();
  const { slug } = params;

  const [saleEditDialog, setSaleEditDialog] = useState(false);
  const [orderEditDialog, setOrderEditDialog] = useState(false);
  const [orderInEdit, setOrderInEdit] = useState<Order | null>(null);
  const [commentDialog, setCommentDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);

  const { isLoading, data: salesData } = useQuery({
    queryKey: ["salesData", slug],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/sales/item/${slug}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching sales data:", error);
        throw error;
      }
    },
  });

  const { isLoading: isFilesLoading, data: filesData } = useQuery({
    queryKey: ["filesData", slug],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/sales/files/${slug}`);
        console.log("Files data:", response);
        return response.data;
      } catch (error) {
        console.error("Error fetching files data:", error);
        return [];
      }
    },
  });

  if (isLoading || isFilesLoading) {
    return <Loader />;
  }

  if (!salesData) {
    return <div>No data available</div>;
  }

  const date = moment(salesData.date).format("DD.MM.YYYY");
  const deadlineDate = moment(salesData.date).add(Number(salesData.deadline), "days");
  const daysLeft = deadlineDate.diff(moment(), "days") > 0 ? deadlineDate.diff(moment(), "days") : 0;
  const orderSum = salesData.orders.reduce((acc: number, order: Order) => acc + order.order_sum, 0);
  const payLeft = orderSum - salesData.prepay;

  function handleOrderEditData(id: number) {
    setOrderInEdit(salesData.orders.find((order: Order) => order.order_id === id) || null);
    setOrderEditDialog(true);
  }

  function handleStatusChange(status: string) {
    queryClient.setQueryData(["salesData", slug], (oldData: Sale | undefined) => {
      if (oldData) {
        return { ...oldData, status };
      }
      return oldData;
    });

    axios
      .post(`/api/sales/update/status`, { status, number: salesData.number })
      .then((response) => {
        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ["salesData", slug] });
        } else {
          console.error("Error updating status");
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  }

  return (
    <div>
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
              <SelectValue className={`status-${salesData.status}`}>{statuses[salesData.status]?.name || salesData.status}</SelectValue>
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
            <Button onClick={() => setCommentDialog(true)} variant="outline" className="border border-solid text-orange-500 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-white">
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

      <div className="orderInfo justify-between border border-zinc-200 dark:border-zinc-800 rounded-sm px-6 m-6">
        <div className="grid grid-cols-10 divide-x-1 text-left py-4 text-default dark:text-zinc-600 text-sm gap-8 items-center ">
          <div className="col-span-2 cutLine">{ui.global.customer}</div>
          <div className="cutLine">{ui.global.phone}</div>
          <div className="cutLine">{ui.global.email}</div>
          <div className="col-span-2 cutLine">{ui.global.address}</div>
          <div className="cutLine">{ui.global.order_sum}</div>
          <div className="cutLine">{ui.global.paid}</div>
          <div className="cutLine">{ui.global.left}</div>
          <div className="cutLine flex items-center justify-between">
            {ui.global.deadline}
            <div>
              <Button variant={"outline"} className="flex ml-auto text-black dark:text-white" onClick={() => setSaleEditDialog(true)}>
                <RiEditFill />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10 divide-x-1 text-left gap-8 py-6 border-t border-zinc-200 dark:border-zinc-800 divide-x">
          <div className="pl-4 break-all col-span-2">{salesData.client}</div>
          <div className="pl-4">{salesData.tel}</div>
          <div className="pl-4">{salesData.email}</div>
          <div className="col-span-2 pl-4">{salesData.address}</div>
          <div className="pl-4">
            {orderSum.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </div>
          <div className="pl-4">
            {salesData.prepay.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </div>
          <div className={payLeft > 0 ? "text-red-500 pl-4" : "pl-4"}>
            {payLeft.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </div>
          <div className="pl-4">
            {deadlineDate.format("DD.MM.YYYY")} <span className="text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1 rounded-sm">{daysLeft} </span>
          </div>
        </div>
      </div>

      {filesData && filesData.length > 0 && (
        <div className="filesBlock m-6 ">
          <div className="flex flex-wrap gap-4">
            {filesData.map((file: any) => (
              <div className="flex flex-col truncate w-24" key={file.id}>
                <a href={`/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
                  <div key={file.id} className="flex flex-col w-24 h-24">
                    {file.filename.match(/\.(jpeg|jpg|gif|png)$/) ? <Image src={`/uploads/${file.filename}`} alt={file.filename} width={128} height={128} className="object-cover w-24 h-24" /> : <RiFileLine className="w-full h-full text-gray-500" />}
                  </div>
                  <div className="text-xs mt-2 truncate">{file.filename}</div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {salesData.comment && (
        <div className="commentBlock p-6 bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-300 m-6 rounded-sm">
          <div className="flex min-h-10 justify-center">
            <div className=" text-orange-400 p-2 rounded-t-sm">
              <RiMessage2Fill style={{ width: "24px", height: "24px" }} />
            </div>
            <div style={{ whiteSpace: "pre-line" }} className="flex px-4 items-center flex-1">
              {salesData.comment.replace(/\\r\\n/g, "\r\n")}
            </div>
            <Button variant={"ghost"} className=" bg-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white dark:bg-opacity-15 dark:bg-orange-900 dark:text-orange-200" onClick={() => setCommentDialog(true)}>
              <RiEditFill />
            </Button>
          </div>
        </div>
      )}

      <div className="ordersBlock m-6 border border-zinc-200 dark:border-zinc-800 rounded-sm px-6">
        <div className="flex flex-col">
          <div className="flex text-left py-6 text-default dark:text-zinc-600 text-sm">
            <div className="w-[10%]">{ui.order.order_number}</div>
            <div className="flex-1">{ui.order.description}</div>
            <div className="w-[5%]">{ui.order.qty}</div>
            <div className="w-[10%]">{ui.order.price}</div>
            <div className="w-[5%]">{ui.order.discount}</div>
            <div className="w-[10%]">{ui.order.sum}</div>
            <div className="w-[4%]"></div>
          </div>
          {salesData.orders.map((order: Order) => (
            <div key={order.order_id} className="flex border-t border-zinc-200 dark:border-zinc-800 py-6 items-center">
              <div className="w-[10%]">
                {salesData.number}-{order.order_id}
              </div>
              <div className="flex-1">{order.description}</div>
              <div className="w-[5%]">{order.qty}</div>
              <div className="w-[10%]">
                {order.price.toLocaleString("uk-UA", {
                  style: "currency",
                  currency: "UAH",
                })}
              </div>
              <div className="w-[5%]">{order.order_dis}</div>
              <div className="w-[10%]">
                {order.order_sum.toLocaleString("uk-UA", {
                  style: "currency",
                  currency: "UAH",
                })}
              </div>
              <div className="w-[4%] flex">
                <Button className="ml-auto" variant={"outline"} onClick={() => handleOrderEditData(order.order_id)}>
                  <RiEditFill />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SaleEditDialog dialog={saleEditDialog} trigger={setSaleEditDialog} data={salesData} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["salesData", slug] })} />
      <OrderEditDialog dialog={orderEditDialog} trigger={setOrderEditDialog} data={orderInEdit} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["salesData", slug] })} />
      <CommentDialog dialog={commentDialog} trigger={setCommentDialog} data={{ number: salesData.number, comment: salesData.comment }} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["salesData", slug] })} />
      <UploadDialog dialog={uploadDialog} trigger={setUploadDialog} number={salesData.number} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["filesData", slug] })} />
    </div>
  );
}
