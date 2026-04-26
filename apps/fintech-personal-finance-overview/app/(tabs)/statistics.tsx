import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useCurrency } from '@/hooks/use-currency';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTimePeriod, periodOptions } from '@/hooks/use-time-period';
import { monthlyBudgetUsd } from '@/data/transactions';
import { exportPdf, exportCsv } from '@/utils/export';

export default function StatisticsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const s = isDark ? darkStyles : lightStyles;

  const { currency, allCurrencies, setCurrencyByCode, format, convert } = useCurrency();
  const { period, setPeriod, periodLabel, filteredTransactions, categorySpending, totalSpent } = useTimePeriod();

  // Scale budget proportionally to selected period
  const periodBudgetUsd = useMemo(() => {
    const scale = { '1W': 7 / 30, '1M': 1, '3M': 3, '6M': 6 };
    return Math.round(monthlyBudgetUsd * scale[period]);
  }, [period]);
  const remainingUsd = periodBudgetUsd - totalSpent;

  const handleExportPdf = useCallback(() => {
    exportPdf(filteredTransactions, categorySpending, totalSpent, periodBudgetUsd, currency, periodLabel);
  }, [filteredTransactions, categorySpending, totalSpent, periodBudgetUsd, currency, periodLabel]);

  const handleExportCsv = useCallback(() => {
    exportCsv(filteredTransactions, categorySpending, totalSpent, currency, periodLabel);
  }, [filteredTransactions, categorySpending, totalSpent, currency, periodLabel]);

  const legendFontColor = isDark ? '#ccc' : '#333';

  const pieData = useMemo(
    () =>
      categorySpending.map((s) => ({
        name: s.category.label,
        amount: Math.round(convert(s.total)),
        color: s.category.color,
        legendFontColor,
        legendFontSize: 14,
      })),
    [categorySpending, convert, legendFontColor],
  );

  const chartConfig = useMemo(() => ({
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(200, 200, 200, ${opacity})` : `rgba(51, 51, 51, ${opacity})`,
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
  }), [isDark]);

  return (
    <ScrollView style={[styles.container, s.container]} contentContainerStyle={styles.content}>
      {/* Time Period Selector */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, s.textPrimary]}>Time Period</Text>
        <View style={[styles.periodSelector, s.periodBg]}>
          {periodOptions.map((opt) => (
            <Pressable
              key={opt.key}
              style={[styles.periodButton, period === opt.key && styles.periodButtonActive]}
              onPress={() => setPeriod(opt.key)}
            >
              <Text style={[styles.periodText, s.textSecondary, period === opt.key && styles.periodTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Currency Selector */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, s.textPrimary]}>Currency</Text>
        <View style={styles.currencySelector}>
          {allCurrencies.map((cur) => (
            <Pressable
              key={cur.code}
              style={[styles.currencyButton, s.chipBg, currency.code === cur.code && styles.currencyButtonActive]}
              onPress={() => setCurrencyByCode(cur.code)}
            >
              <Text style={[styles.currencyText, s.textSecondary, currency.code === cur.code && styles.currencyTextActive]}>
                {cur.symbol} {cur.code}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Spending by Category Chart */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, s.textPrimary]}>Spending by Category — {periodLabel}</Text>
        {pieData.length > 0 ? (
          <>
            <PieChart
              data={pieData}
              width={Dimensions.get('window').width - 32}
              height={160}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              center={[0, 0]}
              absolute
            />
            <View style={styles.legendList}>
              {categorySpending.map((cs) => (
                <View key={cs.category.key} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: cs.category.color }]} />
                  <Text style={[styles.legendLabel, s.textSecondary]}>{cs.category.label}</Text>
                  <Text style={[styles.legendAmount, s.textPrimary]}>{format(cs.total)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>No transactions in this period</Text>
        )}
      </View>

      {/* Budget Card */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, s.textPrimary]}>Budget — {periodLabel}</Text>
        <View style={[styles.budgetCard, s.card]}>
          <View style={styles.budgetRow}>
            <Text style={[styles.budgetLabel, s.textSecondary]}>Budget</Text>
            <Text style={[styles.budgetValue, s.textPrimary]}>{format(periodBudgetUsd)}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={[styles.budgetLabel, s.textSecondary]}>Spent</Text>
            <Text style={[styles.budgetValue, styles.spentText]}>{format(totalSpent)}</Text>
          </View>
          <View style={[styles.budgetDivider, s.divider]} />
          <View style={styles.budgetRow}>
            <Text style={[styles.budgetLabel, styles.remainingLabel, s.textPrimary]}>Remaining</Text>
            <Text style={[styles.budgetValue, remainingUsd >= 0 ? styles.positiveText : styles.negativeText]}>
              {format(remainingUsd)}
            </Text>
          </View>
        </View>
      </View>

      {/* Export Buttons */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, s.textPrimary]}>Export Data</Text>
        <View style={styles.exportRow}>
          <Pressable style={styles.exportButton} onPress={handleExportPdf}>
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </Pressable>
          <Pressable style={styles.exportButton} onPress={handleExportCsv}>
            <Text style={styles.exportButtonText}>Export CSV</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },

  // Period selector
  periodSelector: { flexDirection: 'row', borderRadius: 10, padding: 3 },
  periodButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  periodButtonActive: { backgroundColor: '#0a7ea4' },
  periodText: { fontSize: 13, fontWeight: '600' },
  periodTextActive: { color: '#fff' },

  // Currency selector
  currencySelector: { flexDirection: 'row', gap: 8 },
  currencyButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  currencyButtonActive: { backgroundColor: '#0a7ea4' },
  currencyText: { fontSize: 14, fontWeight: '600' },
  currencyTextActive: { color: '#fff' },

  // Legend
  legendList: { marginTop: 12, gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 14 },
  legendAmount: { fontSize: 14, fontWeight: '600' },

  // Budget card
  budgetCard: { borderRadius: 12, padding: 16 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  budgetLabel: { fontSize: 16 },
  budgetValue: { fontSize: 16, fontWeight: '600' },
  budgetDivider: { height: 1, marginVertical: 8 },
  remainingLabel: { fontWeight: '600' },
  spentText: { color: '#e53935' },
  positiveText: { color: '#43a047' },
  negativeText: { color: '#e53935' },

  // Export
  exportRow: { flexDirection: 'row', gap: 12 },
  exportButton: { backgroundColor: '#0a7ea4', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  exportButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  emptyText: { fontSize: 14, color: '#999', fontStyle: 'italic', textAlign: 'center', paddingVertical: 24 },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#f5f7fa' },
  card: { backgroundColor: '#f5f5f5' },
  chipBg: { backgroundColor: '#f0f0f0' },
  periodBg: { backgroundColor: '#f0f0f0' },
  textPrimary: { color: '#333' },
  textSecondary: { color: '#555' },
  divider: { backgroundColor: '#ddd' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#151718' },
  card: { backgroundColor: '#1e2022' },
  chipBg: { backgroundColor: '#2a2d30' },
  periodBg: { backgroundColor: '#2a2d30' },
  textPrimary: { color: '#ECEDEE' },
  textSecondary: { color: '#9BA1A6' },
  divider: { backgroundColor: '#3a3d40' },
});
