"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { Order } from "@/app/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormValues extends Order {
  discount: number;
}

export default function OrderEditDialog({ dialog, trigger, data, fetchSalesData }: { dialog: any; trigger: any; data: any; fetchSalesData: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
      reset(data);
      setValue("discount", data.order_dis * 100);
    }
  }, [data, reset, setValue]);

  const qty = watch("qty");
  const price = watch("price");
  const discount = watch("discount");

  useEffect(() => {
    const order_dis = discount / 100;
    setValue("order_dis", order_dis);
    const order_sum = qty * price * (1 - order_dis);
    setValue("order_sum", order_sum);
  }, [qty, price, discount, setValue]);

  useEffect(() => {
    const order_dis = watch("order_dis");
    const discount = order_dis * 100;
    setValue("discount", discount);
  }, [watch("order_dis"), setValue]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const response = await axios.post("/api/sales/update/order", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      trigger();
      fetchSalesData();
    },
    onError: (error: any) => {
      console.error("Error updating order:", error);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    mutation.mutate(formData);
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
            <Label>Опис виробу *</Label>
            <Textarea {...register("description", { required: true })} />
            {errors.description && <span>Поле обов'язкове</span>}
          </div>
          <div style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <Label>Кількість *</Label>
              <Input type="number" {...register("qty", { required: true })} />
              {errors.qty && <span>Поле обов'язкове</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>Ціна *</Label>
              <Input type="number" {...register("price", { required: true })} />
              {errors.price && <span>Поле обов'язкове</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>Знижка (%)</Label>
              <Input type="number" {...register("discount", { required: true, min: 0, max: 100 })} />
              {errors.discount && <span>Значення від 0 до 100</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>Сума</Label>
              <Input type="number" {...register("order_sum", { required: true })} readOnly />
              {errors.order_sum && <span>Поле обов'язкове</span>}
            </div>
          </div>
          <input type="hidden" {...register("order_dis")} />
          <Button type="submit">Зберегти</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
