const currencyFormatter =
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  });

export function formatCurrency(
  value: string | number,
  currency = 'MDL',
): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `${String(value)} ${currency}`;
  }

  return `${currencyFormatter.format(
    numericValue,
  )} ${currency}`;
}
