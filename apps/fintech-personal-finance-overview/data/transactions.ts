import { categories } from './categories';

export interface Transaction {
  id: string;
  category: string;
  description: string;
  /** Amount in USD */
  amount: number;
  date: Date;
}

/**
 * Generate realistic sample transactions spanning the last 6 months.
 * Seeded deterministically so the data is stable across renders.
 */
function generateTransactions(): Transaction[] {
  const now = new Date();
  const txns: Transaction[] = [];
  let id = 1;

  const templates: { category: string; descriptions: string[]; minAmount: number; maxAmount: number }[] = [
    { category: 'food', descriptions: ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Fast Food', 'Bakery'], minAmount: 5, maxAmount: 120 },
    { category: 'transport', descriptions: ['Gas Station', 'Uber Ride', 'Bus Pass', 'Parking', 'Car Wash'], minAmount: 5, maxAmount: 80 },
    { category: 'shopping', descriptions: ['Amazon', 'Clothing Store', 'Electronics', 'Home Depot', 'Book Store'], minAmount: 10, maxAmount: 200 },
    { category: 'bills', descriptions: ['Electric Bill', 'Internet', 'Phone Plan', 'Water Bill', 'Insurance'], minAmount: 30, maxAmount: 200 },
    { category: 'entertainment', descriptions: ['Netflix', 'Movie Theater', 'Concert Tickets', 'Spotify', 'Video Games'], minAmount: 10, maxAmount: 100 },
    { category: 'health', descriptions: ['Pharmacy', 'Gym Membership', 'Doctor Visit', 'Supplements', 'Dentist'], minAmount: 15, maxAmount: 150 },
  ];

  // Simple seeded pseudo-random (mulberry32)
  let seed = 42;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    // Generate 15-25 transactions per month
    const txnCount = Math.floor(rand() * 11) + 15;

    for (let i = 0; i < txnCount; i++) {
      const template = templates[Math.floor(rand() * templates.length)];
      const desc = template.descriptions[Math.floor(rand() * template.descriptions.length)];
      const amount = Math.round((rand() * (template.maxAmount - template.minAmount) + template.minAmount) * 100) / 100;
      const day = Math.floor(rand() * daysInMonth) + 1;

      txns.push({
        id: `txn-${id++}`,
        category: template.category,
        description: desc,
        amount,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
      });
    }
  }

  return txns.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const transactions: Transaction[] = generateTransactions();

/** Monthly budgets in USD keyed by period label */
export const monthlyBudgetUsd = 2000;
