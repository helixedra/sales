"use client";
import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftFill } from "react-icons/ri";
import ui from "@/app/data/ui";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewSale() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const number = searchParams.get("number");
  const [orderNumber, setOrderNumber] = useState(number);
  const [formData, setFormData] = useState({
    number,
    clientName: "",
    email: "",
    phone: "",
    address: "",
    term: "30",
    prepayment: "0",
    comment: "",
    orderItems: [
      {
        id: 1,
        description: "",
        quantity: "",
        price: "",
        discount: "0",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.orderItems];
    updatedItems[index][field] = value;
    setFormData({ ...formData, orderItems: updatedItems });
  };

  const addOrderLine = () => {
    setFormData({
      ...formData,
      orderItems: [
        ...formData.orderItems,
        {
          id: formData.orderItems.length + 1,
          description: "",
          quantity: "",
          price: "",
          discount: "0",
        },
      ],
    });
  };

  const mutationFn = async (newSale: typeof formData) => {
    return axios.post("/api/sales/add", newSale);
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Error saving sale:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Calculate total with discount for an item
  const calculateItemTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const discount = parseInt(item.discount) || 0;

    const total = quantity * price;
    const discountedTotal = total - (total * discount) / 100;

    return discountedTotal.toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Link href="/" className="inline-flex items-center mr-4">
          <RiArrowLeftFill className="text-xl" />
        </Link>
        <h1 className="text-2xl font-bold">
          {ui.sales_table.order} {ui.global.num} {orderNumber}
        </h1>
      </div>

      <hr className="border-gray-300 mb-6" />

      <form onSubmit={handleSubmit}>
        {/* <input type="text" name="number" hidden={true} value={orderNumber} /> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {ui.sales_table.customer} <span className="text-red-500">*</span>
            </label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {ui.sales_table.deadline} {ui.global.dd}
              <span className="text-red-500">*</span>
            </label>
            <input type="number" name="term" value={formData.term} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
          </div>

          <div className="col-span-1 row-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.sales_table.comment}</label>
            <textarea name="comment" value={formData.comment} onChange={handleInputChange} rows="5" className="w-full p-2 border border-gray-300 rounded h-full" />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.global.email}</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>

          {/* <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
          {ui.sales_table.prepay} <span className="text-red-500">*</span>
            </label>
            <input type="number" name="prepayment" value={formData.prepayment} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
            <span className="text-sm text-gray-500">грн.</span>
          </div> */}

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {ui.global.phone} <span className="text-red-500">*</span>
            </label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.global.address}</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">{ui.global.items}</h2>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-sm text-left w-0.5/12">{ui.global.num}</th>
                <th className="p-2 text-sm text-left w-4/12">{ui.global.description}</th>
                <th className="p-2 text-sm text-center w-1/12">{ui.order.qty}</th>
                <th className="p-2 text-sm text-center w-2/12">{ui.order.price}</th>
                <th className="p-2 text-sm text-center w-2/12">{ui.order.sum}</th>
                <th className="p-2 text-sm text-center w-1/12">{ui.order.discount}</th>
                <th className="p-2 text-sm text-center w-2/12">{ui.order.sum_with_discount}</th>
              </tr>
            </thead>
            <tbody>
              {formData.orderItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 border">{item.id}</td>
                  <td className="p-2 border">
                    <textarea type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="w-full p-1" />
                  </td>
                  <td className="p-2 border">
                    <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-full p-1 text-center" />
                  </td>
                  <td className="p-2 border">
                    <input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} className="w-full p-1 text-center" />
                  </td>
                  <td className="p-2 border text-center">{(parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
                  <td className="p-2 border">
                    <select value={item.discount} onChange={(e) => handleItemChange(index, "discount", e.target.value)} className="w-full p-1 text-center">
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                    </select>
                  </td>
                  <td className="p-2 border text-center">{calculateItemTotal(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" onClick={addOrderLine} className="border border-dashed border-gray-300 py-2 text-center w-full mb-6 text-gray-500 hover:bg-gray-50">
          {ui.global.add_line}
        </button>

        <Button type="submit">{ui.global.save}</Button>
      </form>
    </div>
  );
}
