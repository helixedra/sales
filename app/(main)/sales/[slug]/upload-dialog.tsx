"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Description } from "@radix-ui/react-dialog";

interface FormValues {
  file: FileList | null;
  imageFromClipboard: string | null;
  category: string;
  number: string;
}

export default function UploadDialog({ dialog, trigger, fetchSalesData, number }: { dialog: any; trigger: any; fetchSalesData: () => void; number: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      file: null,
      imageFromClipboard: null,
      category: "sale",
      number: number,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const response = await axios.post("/api/sales/upload", formDataToSend);
      //   console.log("Upload response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      //   console.log("Upload successful:", data);
      queryClient.invalidateQueries({ queryKey: ["filesData", number] });
      trigger();
      fetchSalesData();
      handleClearForm();
    },
    onError: (error: any) => {
      console.error("Error uploading file:", error);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // console.log("Form data received:", formData);

    const formDataToSend = new FormData();

    if (selectedFile) {
      //   console.log("Adding file:", {
      //     name: selectedFile.name,
      //     type: selectedFile.type,
      //     size: selectedFile.size,
      //   });
      formDataToSend.append("file", selectedFile);
    }

    if (formData.imageFromClipboard) {
      //   console.log("Adding clipboard image");
      formDataToSend.append("imageFromClipboard", formData.imageFromClipboard);
    }

    formDataToSend.append("category", formData.category);
    formDataToSend.append("number", formData.number);

    // console.log("FormData entries before submission:", [...formDataToSend.entries()]);

    if ([...formDataToSend.entries()].length === 0) {
      //   console.error("No file or image to upload");
      return;
    }

    mutation.mutate(formDataToSend);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("File change event:", event.target.files?.[0]);

    const file = event.target.files?.[0];
    if (!file) {
      //   console.error("No file selected");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setSelectedFile(file);
        setValue("imageFromClipboard", null, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          setValue("imageFromClipboard", e.target?.result as string);
          setImagePreview(e.target?.result as string);
          setSelectedFile(null);
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handlePasteButtonClick = () => {
    navigator.clipboard.read().then((items) => {
      for (const item of items) {
        if (item.types.includes("image/png")) {
          item.getType("image/png").then((blob) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setValue("imageFromClipboard", e.target?.result as string);
              setImagePreview(e.target?.result as string);
              setSelectedFile(null);
            };
            reader.readAsDataURL(blob);
          });
        }
      }
    });
  };

  const handleClearForm = () => {
    reset();
    setImagePreview(null);
    setSelectedFile(null);
  };

  const file = watch("file");
  const imageFromClipboard = watch("imageFromClipboard");

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent onPaste={handlePaste}>
        <DialogHeader>
          <DialogTitle>Завантаження файлів</DialogTitle>
          <Description />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("category")} value="sale" />
          <input type="hidden" {...register("number")} value={number} />
          {!file && !imageFromClipboard && (
            <div style={{ paddingBottom: "1rem" }}>
              <Label>Виберіть файл для завантаження *</Label>
              <Input type="file" {...register("file", { required: !imageFromClipboard })} onChange={handleFileChange} />
              {errors.file && <span>Поле обов'язкове</span>}
            </div>
          )}
          {imagePreview && (
            <div style={{ paddingBottom: "1rem" }}>
              <Label>Попередній перегляд зображення</Label>
              <img src={imagePreview} alt="Image Preview" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          )}
          {!file && !imageFromClipboard && (
            <div style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}>
              <Button type="button" onClick={handlePasteButtonClick}>
                Вставити з буфера
              </Button>
            </div>
          )}
          {(file || imageFromClipboard) && (
            <div style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}>
              <Button type="button" onClick={handleClearForm}>
                Очистити форму
              </Button>
            </div>
          )}
          <Button type="submit">Завантажити</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
