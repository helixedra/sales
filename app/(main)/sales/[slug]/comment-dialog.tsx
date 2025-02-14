"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";

type FormValues = {
  comment: string;
};

export default function CommentDialog({ dialog, trigger, data, fetchSalesData }: { dialog: any; trigger: any; data: any; fetchSalesData: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      const response = await axios.post("/api/sales/update/comment", formData);
      if (response.status === 200) {
        trigger();
        fetchSalesData();
      } else {
        console.error("Error updating comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редагування коментаря</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>Коментар</Label>
            <Textarea {...register("comment")} />
            {errors.comment && <span>Поле обов'язкове</span>}
          </div>
          <Button type="submit">Зберегти</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
