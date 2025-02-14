"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import moment from "moment";

type FormValues = {
  number: number;
  client: string;
  email: string;
  tel: string;
  address: string;
  deadline: number;
  prepay: number;
};

export default function SaleEditDialog({ dialog, trigger, data, fetchSalesData }: { dialog: any; trigger: any; data: any; fetchSalesData: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: data,
  });

  const deadline = useWatch({
    control,
    name: "deadline",
    defaultValue: data.deadline,
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = { ...data, number: data.number };
    try {
      const response = await fetch("/api/sales/update/sale-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        trigger();
        fetchSalesData();
      } else {
        // console.error("Error updating sale");
      }
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редагування замовлення</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Ім'я кліента *</Label>
            <Input {...register("client", { required: true })} />
            {errors.client && <span>This field is required</span>}
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>E-mail</Label>
            <Input {...register("email")} />
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Телефон *</Label>
            <Input {...register("tel", { required: true })} />
            {errors.tel && <span>This field is required</span>}
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Адреса</Label>
            <Input {...register("address")} />
          </div>
          <div style={{ paddingBottom: "1rem" }} className="relative">
            <Label>Термін (дні)</Label>
            <Input type="number" {...register("deadline")} />
            <div className="absolute right-3 top-9 text-sm text-zinc-500">{moment(data.date).add(Number(deadline), "days").format("DD.MM.YYYY")}</div>
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Передплата (грн)</Label>
            <Input type="number" {...register("prepay")} />
          </div>
          <Button type="submit">Зберегти</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
