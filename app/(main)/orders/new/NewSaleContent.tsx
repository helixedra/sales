"use client";
import { useEffect, useState } from "react";
import { RiArrowLeftFill } from "react-icons/ri";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/hooks/api/useOrderData";
import Link from "next/link";
import ui from "@/app/data/ui.json";

export default function NewSaleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const number = searchParams.get("number");

  const initialFormData = {
    id: 1,
    date: new Date().toISOString(),
    status: "new",
    phone: "",
    number,
    client: "",
    email: "",
    address: "",
    term: "30",
    prepayment: "0",
    comment: "",
    orderItems: [
      {
        id: 0,
        description: "",
        quantity: "",
        price: "",
        discount: "0",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (
    index: number,
    field: "description" | "quantity" | "price" | "discount",
    value: string
  ) => {
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

  useEffect(() => {
    if (number) {
      document.title = `${ui.global.new_order} ${ui.global.num} ${number} - ${ui.pages.site_name}`;
    }
  });

  const mutation = useCreateOrder();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
    router.push("/");
  };

  const calculateItemTotal = (item: {
    quantity: string;
    price: string;
    discount: string;
  }) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const discount = parseInt(item.discount) || 0;

    const total = quantity * price;
    const discountedTotal = total - (total * discount) / 100;

    return discountedTotal.toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">{/* ...existing JSX code... */}</div>
  );
}
