export interface Currency {
  code: string;
  symbol: string;
  name: string;
  /** Exchange rate relative to USD (1 USD = rate in this currency) */
  rate: number;
  decimalPlaces: number;
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, decimalPlaces: 2 },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble', rate: 3.27, decimalPlaces: 2 },
];

export const defaultCurrency = currencies[0];

/** Convert an amount from USD to the target currency */
export function convertAmount(amountUsd: number, target: Currency): number {
  return amountUsd * target.rate;
}

/** Format an amount with the currency symbol */
export function formatAmount(amountUsd: number, target: Currency): string {
  const converted = convertAmount(amountUsd, target);
  const formatted = converted.toLocaleString('en-US', {
    minimumFractionDigits: target.decimalPlaces,
    maximumFractionDigits: target.decimalPlaces,
  });

  if (target.code === 'BYN') {
    return `${formatted} ${target.symbol}`;
  }
  return `${target.symbol}${formatted}`;
}
