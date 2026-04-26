import { useMemo, useState } from 'react';
import { transactions, type Transaction } from '@/data/transactions';
import { categories, type Category } from '@/data/categories';

export type TimePeriod = '1W' | '1M' | '3M' | '6M';

export interface PeriodOption {
  key: TimePeriod;
  label: string;
}

export const periodOptions: PeriodOption[] = [
  { key: '1W', label: 'Week' },
  { key: '1M', label: 'Month' },
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
];

function getStartDate(period: TimePeriod): Date {
  const now = new Date();
  switch (period) {
    case '1W':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    case '1M':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case '3M':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case '6M':
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  }
}

export interface CategorySpending {
  category: Category;
  total: number;
}

export function useTimePeriod() {
  const [period, setPeriod] = useState<TimePeriod>('1M');

  const filteredTransactions = useMemo(() => {
    const start = getStartDate(period);
    return transactions.filter((t) => t.date >= start);
  }, [period]);

  const categorySpending = useMemo(() => {
    const totals = new Map<string, number>();
    for (const txn of filteredTransactions) {
      totals.set(txn.category, (totals.get(txn.category) ?? 0) + txn.amount);
    }

    return categories
      .map((cat) => ({
        category: cat,
        total: Math.round((totals.get(cat.key) ?? 0) * 100) / 100,
      }))
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const totalSpent = useMemo(
    () => Math.round(categorySpending.reduce((sum, s) => sum + s.total, 0) * 100) / 100,
    [categorySpending],
  );

  const periodLabel = periodOptions.find((p) => p.key === period)?.label ?? period;

  return {
    period,
    setPeriod,
    periodLabel,
    filteredTransactions,
    categorySpending,
    totalSpent,
  };
}
