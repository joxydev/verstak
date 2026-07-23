const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCurrency(
  value: string | number,
  currency = "MDL",
): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `${String(value)} ${currency}`;
  }

  return `${currencyFormatter.format(numericValue)} ${currency}`;
}

export function formatDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return dateFormatter.format(date);
}
