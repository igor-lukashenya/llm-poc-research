import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Paths, File as ExpoFile } from 'expo-file-system';
import { Alert, Platform } from 'react-native';
import type { Transaction } from '@/data/transactions';
import type { CategorySpending } from '@/hooks/use-time-period';
import type { Currency } from '@/data/currencies';
import { formatAmount } from '@/data/currencies';

// ── CSV Export ───────────────────────────────────────────────

function buildCsvContent(
  transactions: Transaction[],
  categorySpending: CategorySpending[],
  totalSpent: number,
  currency: Currency,
  periodLabel: string,
): string {
  const lines: string[] = [];

  lines.push(`Finance Report — ${periodLabel}`);
  lines.push('');

  // Summary section
  lines.push('Category,Amount');
  for (const s of categorySpending) {
    lines.push(`${s.category.label},${formatAmount(s.total, currency)}`);
  }
  lines.push(`Total,${formatAmount(totalSpent, currency)}`);
  lines.push('');

  // Transaction details
  lines.push('Date,Category,Description,Amount');
  for (const txn of transactions) {
    const date = txn.date.toISOString().split('T')[0];
    const desc = txn.description.includes(',') ? `"${txn.description}"` : txn.description;
    lines.push(`${date},${txn.category},${desc},${formatAmount(txn.amount, currency)}`);
  }

  return lines.join('\n');
}

async function writeTextFile(filename: string, content: string): Promise<string> {
  const file = new ExpoFile(Paths.cache, filename);
  const encoder = new TextEncoder();
  const stream = file.writableStream();
  const writer = stream.getWriter();
  await writer.write(encoder.encode(content));
  await writer.close();
  return file.uri;
}

export async function exportCsv(
  transactions: Transaction[],
  categorySpending: CategorySpending[],
  totalSpent: number,
  currency: Currency,
  periodLabel: string,
): Promise<void> {
  try {
    const csv = buildCsvContent(transactions, categorySpending, totalSpent, currency, periodLabel);

    if (Platform.OS === 'web') {
      downloadOnWeb(csv, 'finance-report.csv', 'text/csv');
      return;
    }

    const fileUri = await writeTextFile('finance-report.csv', csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' });
    } else {
      Alert.alert('Saved', `CSV saved to ${fileUri}`);
    }
  } catch (err) {
    Alert.alert('Export Error', `Could not export CSV: ${String(err)}`);
  }
}

// ── PDF Export ───────────────────────────────────────────────

function buildPdfHtml(
  transactions: Transaction[],
  categorySpending: CategorySpending[],
  totalSpent: number,
  periodBudget: number,
  currency: Currency,
  periodLabel: string,
): string {
  const remaining = periodBudget - totalSpent;
  const remainingColor = remaining >= 0 ? '#43a047' : '#e53935';

  const categoryRows = categorySpending
    .map(
      (s) => `
      <tr>
        <td><span style="display:inline-block;width:12px;height:12px;border-radius:6px;background:${s.category.color};margin-right:6px;vertical-align:middle;"></span>${s.category.label}</td>
        <td style="text-align:right;">${formatAmount(s.total, currency)}</td>
      </tr>`,
    )
    .join('');

  const txnRows = transactions
    .slice(0, 50)
    .map(
      (txn) => `
      <tr>
        <td>${txn.date.toISOString().split('T')[0]}</td>
        <td>${txn.category}</td>
        <td>${txn.description}</td>
        <td style="text-align:right;">${formatAmount(txn.amount, currency)}</td>
      </tr>`,
    )
    .join('');

  return `
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #333; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 16px; margin-top: 24px; margin-bottom: 8px; color: #555; }
        .subtitle { color: #777; font-size: 13px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
        th { text-align: left; font-weight: 600; background: #f9f9f9; }
        .budget-card { background: #f5f5f5; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
        .budget-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .budget-row .label { color: #555; }
        .budget-row .value { font-weight: 600; }
        .divider { border-top: 1px solid #ddd; margin: 8px 0; }
        .total-row td { font-weight: 600; border-top: 2px solid #ddd; }
      </style>
    </head>
    <body>
      <h1>Finance Report</h1>
      <p class="subtitle">Period: ${periodLabel} · Currency: ${currency.code}</p>

      <div class="budget-card">
        <div class="budget-row"><span class="label">Budget</span><span class="value">${formatAmount(periodBudget, currency)}</span></div>
        <div class="budget-row"><span class="label">Spent</span><span class="value" style="color:#e53935;">${formatAmount(totalSpent, currency)}</span></div>
        <div class="divider"></div>
        <div class="budget-row"><span class="label" style="font-weight:600;">Remaining</span><span class="value" style="color:${remainingColor};">${formatAmount(remaining, currency)}</span></div>
      </div>

      <h2>Spending by Category</h2>
      <table>
        <tr><th>Category</th><th style="text-align:right;">Amount</th></tr>
        ${categoryRows}
        <tr class="total-row"><td>Total</td><td style="text-align:right;">${formatAmount(totalSpent, currency)}</td></tr>
      </table>

      <h2>Recent Transactions</h2>
      <table>
        <tr><th>Date</th><th>Category</th><th>Description</th><th style="text-align:right;">Amount</th></tr>
        ${txnRows}
      </table>
      ${transactions.length > 50 ? `<p style="color:#999;font-size:12px;">Showing 50 of ${transactions.length} transactions</p>` : ''}
    </body>
    </html>
  `;
}

export async function exportPdf(
  transactions: Transaction[],
  categorySpending: CategorySpending[],
  totalSpent: number,
  periodBudget: number,
  currency: Currency,
  periodLabel: string,
): Promise<void> {
  try {
    const html = buildPdfHtml(transactions, categorySpending, totalSpent, periodBudget, currency, periodLabel);

    if (Platform.OS === 'web') {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
        win.print();
      }
      return;
    }

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    } else {
      Alert.alert('Saved', `PDF saved to ${uri}`);
    }
  } catch (err) {
    Alert.alert('Export Error', `Could not export PDF: ${String(err)}`);
  }
}

// ── Web download helper ──────────────────────────────────────

function downloadOnWeb(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
