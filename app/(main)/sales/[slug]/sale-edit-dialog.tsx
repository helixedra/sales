"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import moment from "moment";
import { Sale } from "@/app/types/sale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Description } from "@radix-ui/react-dialog";

export default function SaleEditDialog({ dialog, trigger, data, fetchSalesData }: { dialog: any; trigger: any; data: any; fetchSalesData: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Sale>({
    defaultValues: data,
  });

  const deadline = useWatch({
    control,
    name: "deadline",
    defaultValue: data.deadline,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: Sale) => axios.post("/api/sales/update/sale-info", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      trigger();
      fetchSalesData();
    },
    onError: (error: any) => {
      console.error("Error updating sale:", error);
    },
  });

  const onSubmit: SubmitHandler<Sale> = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редагування замовлення</DialogTitle>
          <Description />
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
