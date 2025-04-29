import { Order } from "@/app/types/Order";
import clsx from "clsx";
import { TABLE } from "@/components/pages/homepage/constants";
import Status from "@/components/shared/status";
import { orderDates } from "@/lib/order-dates";
import { orderTotal, orderLeft } from "@/lib/order-numbers";
import { Item } from "@/app/types/Item";
import statuses from "@/lib/status";
import { TABLE_ROW_STYLES } from "@/components/pages/homepage/constants";

// Styles

export default function OrderItem({ order }: { order: Order }) {
  const stylingCancel = (status: string) =>
    clsx({
      "line-through opacity-40": status === "canceled",
    });

  return (
    <div className={TABLE_ROW_STYLES}>
      <div className={`${TABLE[0].width} ${stylingCancel(order.status)}`}>
        {order.number}
      </div>
      <div className={`${TABLE[1].width} ${stylingCancel(order.status)}`}>
        {orderDates(order).dateLocal}
      </div>
      <div className={`${TABLE[2].width} ${stylingCancel(order.status)}`}>
        <Status
          status={order.status}
          name={statuses[order.status].name}
          className="opacity-100 no-line-through"
        />
      </div>
      <div className={`${TABLE[3].width} ${stylingCancel(order.status)}`}>
        {order.client}
      </div>
      <div className={`${TABLE[4].width} ${stylingCancel(order.status)}`}>
        {order.items.map((item: Item) => (
          <div key={item.id} className="OrderItem" title={item.description}>
            {item.description}
          </div>
        ))}
      </div>
      <div className={`${TABLE[5].width} ${stylingCancel(order.status)}`}>
        {orderTotal(order).numberDigital}
      </div>
      <div className={`${TABLE[6].width} ${stylingCancel(order.status)}`}>
        {orderLeft(order).numberDigital}
      </div>
      <div className={`${TABLE[7].width} ${stylingCancel(order.status)}`}>
        {orderDates(order).deadlineLocalDate}
      </div>
      <div className={`${TABLE[8].width}  ${stylingCancel(order.status)}`}>
        {orderDates(order).deadlineDaysLeft}
      </div>
    </div>
  );
}
