export interface Category {
  key: string;
  label: string;
  color: string;
  icon: string;
}

export const categories: Category[] = [
  { key: 'food', label: 'Food', color: '#FF6384', icon: '🍔' },
  { key: 'transport', label: 'Transport', color: '#36A2EB', icon: '🚗' },
  { key: 'shopping', label: 'Shopping', color: '#FFCE56', icon: '🛍️' },
  { key: 'bills', label: 'Bills', color: '#4BC0C0', icon: '📄' },
  { key: 'entertainment', label: 'Entertainment', color: '#9966FF', icon: '🎬' },
  { key: 'health', label: 'Health', color: '#FF9F40', icon: '💊' },
];

export function getCategoryByKey(key: string): Category | undefined {
  return categories.find((c) => c.key === key);
}
