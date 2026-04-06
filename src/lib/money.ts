/** Precios en USD (moneda oficial en Ecuador). */
export function formatMoney(
  amount: number,
  currency: string = 'USD',
): string {
  const code = currency === 'EUR' ? 'EUR' : 'USD'
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount)
}
