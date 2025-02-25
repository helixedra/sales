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
import Files from "@/components/pages/sale/files";
import Orders from "@/components/pages/sale/orders";
import TopBar from "@/components/pages/sale/topbar";

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
        // console.log("Files data:", response);
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
    if (id === 0) {
      setOrderInEdit({ description: "", qty: 1, price: "", discount: 0, order_sum: 0, order_dis: 0, number: salesData.number });
    } else {
      setOrderInEdit(salesData.orders.find((order: Order) => order.order_id === id) || null);
    }

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
      <TopBar salesData={salesData} setCommentDialog={setCommentDialog} setUploadDialog={setUploadDialog} handleStatusChange={handleStatusChange} />

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
            {orderSum?.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </div>
          <div className="pl-4">
            {salesData.prepay?.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </div>
          <div className={payLeft > 0 ? "text-red-500 pl-4" : "pl-4"}>
            {payLeft?.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </div>
          <div className="pl-4">
            {deadlineDate?.format("DD.MM.YYYY")} <span className="text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1 rounded-sm">{daysLeft} </span>
          </div>
        </div>
      </div>

      {filesData && filesData.length > 0 && <Files data={filesData} />}

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

      <Orders data={salesData} handler={handleOrderEditData} />

      <SaleEditDialog dialog={saleEditDialog} trigger={setSaleEditDialog} data={salesData} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["salesData", slug] })} />
      <OrderEditDialog saleNumber={salesData.number} dialog={orderEditDialog} trigger={setOrderEditDialog} data={orderInEdit} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["salesData", slug] })} />
      <CommentDialog dialog={commentDialog} trigger={setCommentDialog} data={{ number: salesData.number, comment: salesData.comment }} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["salesData", slug] })} />
      <UploadDialog dialog={uploadDialog} trigger={setUploadDialog} number={salesData.number} fetchSalesData={() => queryClient.invalidateQueries({ queryKey: ["filesData", slug] })} />
    </div>
  );
}
