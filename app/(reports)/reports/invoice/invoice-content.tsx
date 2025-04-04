"use client";
import { useOrderData } from "@/hooks/api/useOrderData";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import { Item } from "@/app/types/Item";
import { orderTotal } from "@/lib/order-numbers";
import account from "@/app/data/account.json";
import { num2str } from "@/lib/num-words";
import { moneyFormatDigital } from "@/lib/format";
import Image from "next/image";
import options from "@/app/data/options.json";
import { discountNumbers } from "@/lib/item-numbers";
import { itemNumbers } from "@/lib/item-numbers";

type RequestFormProps = {
  number: string;
  supplier: string;
  date: string;
  signature?: boolean;
};

export function InvoiceContent({ number, supplier, date }: RequestFormProps) {
  const { isLoading, error, data: order } = useOrderData(Number(number));
  const acc = account.finance.data_options.find(
    (option) => option.ipn === supplier
  );

  if (isLoading) return <Loader />;

  return (
    <>
      {order && (
        <div className="p-12 font-mono text-sm max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="border-2 border-black p-4 w-2/3">
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-zinc-300">
                  <span>Постачальник</span>
                  <span>{acc?.name}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300">
                  <span>Адреса:</span>
                  <span className="">{acc?.address}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300">
                  <span>Р/р:</span>
                  <span>{acc?.bank.account}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300">
                  <span>в</span>
                  <span>{acc?.bank.name}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300">
                  <span>МФО:</span>
                  <span>{acc?.bank.mfo}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300">
                  <span>ІПН/ЄДРПОУ:</span>
                  <span>{acc?.ipn}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300">
                  <span>Тел.</span>
                  <span>{acc?.phone}</span>
                </li>
              </ul>
            </div>

            <div className="text-center font-semibold ml-24">
              <h1 className="text-2xl uppercase">Рахунок-Фактура</h1>
              <div className="flex items-center justify-center text-lg mt-4">
                <span>N</span>
                <div className="border-2 border-black w-48 py-2 ml-2">
                  {number}
                </div>
              </div>
              <div className="mt-6">від {date}</div>
            </div>
          </div>

          {/* Payer */}
          <div className="border-2 border-black p-4 font-semibold mt-6">
            <div className="flex justify-between border-b border-zinc-300">
              <span>Платник</span>
              <span className="w-full text-center">{order.client}</span>
            </div>
          </div>

          {/* Order Items Table */}
          <table className="w-full border-2 border-black text-left mt-6">
            <thead className="font-semibold border-b border-black">
              <tr>
                <th className="p-2 border-r border-black">№</th>
                <th className="p-2 border-r border-black">
                  Найменування товару
                </th>
                <th className="p-2 text-center border-r border-black">
                  Кількість
                </th>
                <th className="p-2 text-right border-r border-black">
                  Ціна за одиницю
                </th>
                <th className="p-2 text-right border-r border-black">
                  Сума, грн.
                </th>
              </tr>
            </thead>
            <tbody>
              {order?.items.map((item: Item, index: number) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="p-2 text-center border-r border-black">
                    {index + 1}
                  </td>
                  <td className="p-2 border-r border-black">
                    {item.description}
                  </td>
                  <td className="p-2 text-center border-r border-black">
                    {item.quantity}
                  </td>
                  <td className="p-2 text-right border-r border-black">
                    {discountNumbers(item).discountedPriceFormatted}
                  </td>
                  <td className="p-2 text-right">
                    {itemNumbers(item).totalWithDiscountFormatted}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold border-t-2 border-black">
                <td colSpan={4} className="p-2 border-r border-black">
                  Всього
                </td>
                <td className="p-2 text-right">
                  {moneyFormatDigital(orderTotal(order).number)}
                </td>
              </tr>
              <tr className="font-semibold border-t border-black">
                <td colSpan={4} className="p-2 border-r border-black">
                  Податок на додану вартість (ПДВ)
                </td>
                <td className="p-2 text-right">0.00</td>
              </tr>
              <tr className="font-semibold border-t border-black">
                <td colSpan={4} className="p-2 border-r border-black">
                  Загальна сума з ПДВ
                </td>
                <td className="p-2 text-right">
                  {moneyFormatDigital(orderTotal(order).number)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total Amount */}
          <div className="flex mt-6">
            <span className="">Загальна сума, що підлягає оплаті:</span>
            <span className="border-b border-black italic flex-grow ml-2 font-semibold ">
              {num2str(orderTotal(order).number.toFixed(2))}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
