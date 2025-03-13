// Format number to money format
export function moneyFormat(number: number | string) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(Number(number));
}

export function moneyFormatDigital(number: number | string) {
  return new Intl.NumberFormat('uk-UA', {
    currency: 'UAH',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(number))
}