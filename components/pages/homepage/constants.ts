import ui from "@/app/data/ui.json";

// Constants
export const TABLE: { key: keyof typeof ui.sales_table; width: string }[] = [
  { key: "num", width: "min-w-[50px] max-w-[60px] w-50px md:w-full truncate" },
  {
    key: "date",
    width: "hidden lg:flex min-w-[100px] max-w-[100px] w-full truncate",
  },
  {
    key: "status",
    width: "min-w-[40px] max-w-[150px] w-[60px] lg:w-full truncate",
  },
  { key: "customer", width: "min-w-[100px] max-w-[200px] w-full truncate" },
  { key: "order", width: "min-w-[100px] hidden sm:w-full sm:flex truncate" },
  { key: "total", width: "min-w-[100px] max-w-[100px] w-full truncate" },
  {
    key: "left",
    width: "hidden xl:flex min-w-[100px] max-w-[100px] w-full truncate",
  },
  {
    key: "deadline",
    width: "min-w-[100px] max-w-[100px] w-full hidden md:flex truncate",
  },
  { key: "days_left", width: "min-w-[20px] max-w-[20px] w-[40px] truncate" },
];

export const TABLE_ROW_STYLES = `flex gap-1 lg:gap-4 py-4 px-2 md:px-4 items-center border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900`;

export const TABLE_HEADER_STYLES = `flex gap-1 lg:gap-4 py-4 px-2 md:px-4 items-center text-zinc-500 text-sm border-b border-zinc-100 dark:border-zinc-800 font-semibold sticky top-0 z-10 bg-white dark:bg-zinc-900`;
