// Format number to money format
export function moneyFormat(number: number | string) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(Number(number));
}
