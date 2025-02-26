"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Description } from "@radix-ui/react-dialog";

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: any) => axios.post("/api/sales/update/comment", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      trigger();
      fetchSalesData();
    },
    onError: (error: any) => {
      console.error("Error updating comment:", error);
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
          <DialogTitle>Редагування коментаря</DialogTitle>
          <Description />
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
