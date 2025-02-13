"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  client: string;
  email: string;
  tel: string;
  address: string;
  deadline: number;
  prepay: number;
};

export default function SaleEditDialog({ dialog, trigger, data }: { dialog: any; trigger: any; data: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: data,
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

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
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Термін (дні)</Label>
            <Input type="number" {...register("deadline")} />
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Передплата (грн)</Label>
            <Input type="number" {...register("prepay")} />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
