"use client";
import { useState } from "react";
import { useForm, type SubmitHandler, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { uk as locale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Description } from "@radix-ui/react-dialog";
import account from "@/app/data/account.json";
import ui from "@/app/data/ui.json";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type FormValues = {
  number: number;
  supplier: string;
  date: Date;
};

type Props = {
  dialog: boolean;
  trigger: () => void;
  number: number;
};

export function RequestFormDialog({ dialog, trigger, number }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      number: number,
      supplier: account.finance.data_options[0].ipn,
      date: new Date(),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    window.open(
      `/reports/request?number=${data.number}&supplier=${encodeURIComponent(
        data.supplier
      )}&date=${format(data.date, "dd/MM/yyyy")}`,
      "_blank"
    );
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {ui.global.generate_receipt}
          </DialogTitle>
          <Description className="text-sm text-gray-500" />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              {ui.global.receipt_date}
            </label>
            <CalendarForm register={register} setValue={setValue} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              {ui.global.supplier}
            </label>
            <RadioGroup
              defaultValue={account.finance.data_options[0].ipn}
              onValueChange={(value) => setValue("supplier", value)}
            >
              {account.finance.data_options.map((supplier) => (
                <div key={supplier.ipn} className="flex items-center relative">
                  <RadioGroupItem
                    value={supplier.ipn}
                    {...register("supplier")}
                    className="absolute left-4"
                    id={supplier.ipn}
                  />
                  <Label
                    htmlFor={supplier.ipn}
                    className="text-lg w-full border rounded-md py-4 px-4 pl-10 cursor-pointer hover:bg-zinc-800"
                  >{`${supplier.name} (${supplier.ipn})`}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button type="submit">{ui.global.generate}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CalendarForm({
  register,
  setValue,
}: {
  register: any;
  setValue: any;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isOpen, setIsOpen] = useState(false);

  const field = {
    value: selectedDate,
    onChange: (date: Date | undefined | null) => {
      if (date) {
        setSelectedDate(date);
        setValue("date", date);
      } else {
        setSelectedDate(undefined);
        setValue("date", undefined);
      }
      setIsOpen(false);
    },
  };

  return (
    <>
      <input
        type="hidden"
        {...register("date")}
        value={selectedDate ? selectedDate.toISOString() : ""}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP", { locale }).replace("-е", "")
            ) : (
              <span>{ui.global.pick_date}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={locale}
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < new Date("1900-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
