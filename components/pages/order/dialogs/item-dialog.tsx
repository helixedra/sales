"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { Item } from "@/app/types/item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Description } from "@radix-ui/react-dialog";
import ui from "@/app/data/ui.json";

interface FormValues extends Item {
  _discount: number;
}

interface ItemDialogProps {
  saleNumber: string | number;
  dialog: any;
  trigger: any;
  data: any;
  fetchSalesData: () => void;
}

export function ItemDialog({ saleNumber, dialog, trigger, data, fetchSalesData }: ItemDialogProps) {
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
      setValue("_discount", data.discount * 100);
    }
  }, [data, reset, setValue]);

  const quantity = watch("quantity");
  const price = watch("price");
  const _discount = watch("_discount");

  useEffect(() => {
    const discount = _discount / 100;
    setValue("discount", discount.toFixed(2));
    const total = Number(quantity) * Number(price) * (1 - discount);
    setValue("total", total);
  }, [quantity, price, _discount, setValue]);

  useEffect(() => {
    const discount = watch("discount");
    const _discount = Number(discount) * 100;
    setValue("_discount", _discount);
  }, [watch("discount"), setValue]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const parsedFormData = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        _discount: Number(formData._discount),
        discount: Number(formData.discount),
        total: Number(formData.total),
        number: saleNumber,
      };

      if (!parsedFormData.id) {
        const response = await axios.post("/api/sales/add/Item", parsedFormData);
        return response.data;
      } else {
        const response = await axios.post("/api/sales/update/Item", parsedFormData);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      trigger();
      fetchSalesData();
    },
    onError: (error: any) => {
      console.error("Error updating Item:", error);
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
          <DialogTitle>{ui.global.edit_order}</DialogTitle>
          <Description />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.item_description} *</Label>
            <Textarea {...register("description", { required: true })} />
            {errors.description && <span>{ui.global.field_required}</span>}
          </div>
          <div style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.quantity} *</Label>
              <Input type="number" {...register("quantity", { required: true })} />
              {errors.quantity && <span>{ui.global.field_required}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.price} *</Label>
              <Input type="number" {...register("price", { required: true })} />
              {errors.price && <span>{ui.global.field_required}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.discount_percentage}</Label>
              <Input
                type="number"
                {...register("_discount", { required: true, min: 0, max: 100 })}
              />
              {errors._discount && <span>{ui.global.discount_range}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.total}</Label>
              <Input type="number" {...register("total", { required: true })} readOnly />
              {errors.total && <span>{ui.global.field_required}</span>}
            </div>
          </div>
          <input type="hidden" {...register("discount")} />
          <Button type="submit">{ui.global.save}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
