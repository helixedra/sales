import moment from "moment";
import { Sale } from "@/app/types/sale";

type OrderDates = {
  dateLocal: string;
  deadlineLocalDate: string;
  deadlineDaysLeft: number;
};

export const orderDates = (sale: Sale): OrderDates => {
  const date = moment(sale.date);
  const dateLocal = date.format("DD.MM.YYYY");
  const deadlineDate = moment(sale.date).add(Number(sale.deadline), "days");
  const deadlineLocalDate = deadlineDate.format("DD.MM.YYYY");
  const deadlineDaysDiff = deadlineDate.diff(moment(), "days");
  const deadlineDaysLeft = deadlineDaysDiff < 0 ? 0 : deadlineDaysDiff;

  return {
    dateLocal,
    deadlineLocalDate,
    deadlineDaysLeft,
  };
};
