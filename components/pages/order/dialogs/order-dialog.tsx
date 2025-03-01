'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import moment from 'moment';
import { Order } from '@/app/types/order';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Description } from '@radix-ui/react-dialog';
import ui from '@/app/data/ui.json';

export function OrderDialog({
  dialog,
  trigger,
  data,
  fetchSalesData,
}: {
  dialog: boolean;
  trigger: () => void;
  data: Order;
  fetchSalesData: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Order>({
    defaultValues: data,
  });

  const deadline = useWatch({
    control,
    name: 'deadline',
    defaultValue: data.deadline,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: Order) =>
      axios.post('/api/sales/update/sale-info', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesData'] });
      trigger();
      fetchSalesData();
    },
    onError: (error: any) => {
      console.error('Error updating sale:', error);
    },
  });

  const onSubmit: SubmitHandler<Order> = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ui.global.edit_order}</DialogTitle>
          <Description />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ paddingBottom: '1rem' }}>
            <Label>{ui.global.customer_name} *</Label>
            <Input {...register('client', { required: true })} />
            {errors.client && <span>{ui.global.field_required}</span>}
          </div>
          <div style={{ paddingBottom: '1rem' }}>
            <Label>{ui.global.email}</Label>
            <Input {...register('email')} />
          </div>
          <div style={{ paddingBottom: '1rem' }}>
            <Label>{ui.global.phone_required} *</Label>
            <Input {...register('tel', { required: true })} />
            {errors.tel && <span>{ui.global.field_required}</span>}
          </div>
          <div style={{ paddingBottom: '1rem' }}>
            <Label>{ui.global.address}</Label>
            <Input {...register('address')} />
          </div>
          <div style={{ paddingBottom: '1rem' }} className="relative">
            <Label>{ui.global.deadline_days}</Label>
            <Input type="number" {...register('deadline')} />
            <div className="absolute right-3 top-9 text-sm text-zinc-500">
              {moment(data.date)
                .add(Number(deadline), 'days')
                .format('DD.MM.YYYY')}
            </div>
          </div>
          <div style={{ paddingBottom: '1rem' }}>
            <Label>{ui.global.prepayment}</Label>
            <Input type="number" {...register('prepay')} />
          </div>
          <Button type="submit">{ui.global.save}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
