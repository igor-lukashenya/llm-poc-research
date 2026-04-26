import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { currencies, defaultCurrency, formatAmount, convertAmount, type Currency } from '@/data/currencies';

interface CurrencyContextValue {
  currency: Currency;
  allCurrencies: Currency[];
  setCurrencyByCode: (code: string) => void;
  format: (amountUsd: number) => string;
  convert: (amountUsd: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);

  const setCurrencyByCode = useCallback((code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) setCurrency(found);
  }, []);

  const format = useCallback(
    (amountUsd: number) => formatAmount(amountUsd, currency),
    [currency],
  );

  const convert = useCallback(
    (amountUsd: number) => convertAmount(amountUsd, currency),
    [currency],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, allCurrencies: currencies, setCurrencyByCode, format, convert }),
    [currency, setCurrencyByCode, format, convert],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
