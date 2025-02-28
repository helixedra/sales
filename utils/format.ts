// Format number to money format
export function moneyFormat(number: number) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
  }).format(number);
}
