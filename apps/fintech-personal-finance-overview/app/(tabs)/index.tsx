import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCurrency } from '@/hooks/use-currency';
import { useAuth } from '@/hooks/use-auth';
import { transactions, monthlyBudgetUsd } from '@/data/transactions';
import { getCategoryByKey, categories } from '@/data/categories';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { format } = useCurrency();
  const { user } = useAuth();
  const router = useRouter();

  // Current month stats
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const monthTransactions = useMemo(() => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    return transactions.filter((t) => t.date >= monthStart);
  }, [currentYear, currentMonth]);
  const monthSpent = useMemo(
    () => Math.round(monthTransactions.reduce((s, t) => s + t.amount, 0) * 100) / 100,
    [monthTransactions],
  );
  const remaining = monthlyBudgetUsd - monthSpent;
  const spentPercent = Math.min((monthSpent / monthlyBudgetUsd) * 100, 100);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => transactions.slice(0, 5), []);

  // Quick actions
  const quickActions = [
    { icon: '➕', label: 'Add\nExpense', color: '#e53935' },
    { icon: '💰', label: 'Add\nIncome', color: '#43a047' },
    { icon: '🔄', label: 'Transfer', color: '#1e88e5' },
    { icon: '📊', label: 'Reports', color: '#8e24aa', onPress: () => router.push('/(tabs)/statistics') },
  ];

  const s = isDark ? darkStyles : lightStyles;

  return (
    <ScrollView style={[styles.container, s.container]} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <Text style={[styles.greeting, s.textSecondary]}>Good {getTimeOfDay()},</Text>
      <Text style={[styles.userName, s.textPrimary]}>{user.name}</Text>

      {/* Balance Card */}
      <View style={[styles.balanceCard, s.balanceCard]}>
        <Text style={styles.balanceLabel}>Monthly Budget</Text>
        <Text style={styles.balanceAmount}>{format(monthlyBudgetUsd)}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${spentPercent}%` }, spentPercent > 80 && styles.progressBarDanger]} />
        </View>
        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.balanceSubLabel}>Spent</Text>
            <Text style={styles.balanceSubValue}>{format(monthSpent)}</Text>
          </View>
          <View style={styles.balanceRight}>
            <Text style={styles.balanceSubLabel}>Remaining</Text>
            <Text style={[styles.balanceSubValue, remaining < 0 && { color: '#ff6b6b' }]}>{format(remaining)}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, s.textPrimary]}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((action) => (
          <Pressable key={action.label} style={[styles.actionButton, s.card]} onPress={action.onPress}>
            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
              <Text style={styles.actionEmoji}>{action.icon}</Text>
            </View>
            <Text style={[styles.actionLabel, s.textSecondary]}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Spending by Category (mini) */}
      <Text style={[styles.sectionTitle, s.textPrimary]}>This Month by Category</Text>
      <View style={[styles.categoryGrid]}>
        {categories.map((cat) => {
          const catTotal = monthTransactions
            .filter((t) => t.category === cat.key)
            .reduce((sum, t) => sum + t.amount, 0);
          if (catTotal === 0) return null;
          return (
            <View key={cat.key} style={[styles.categoryChip, s.card]}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, s.textPrimary]}>{cat.label}</Text>
                <Text style={[styles.categoryAmount, { color: cat.color }]}>{format(catTotal)}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recent Transactions */}
      <Text style={[styles.sectionTitle, s.textPrimary]}>Recent Transactions</Text>
      <View style={[styles.transactionsList, s.card]}>
        {recentTransactions.map((txn, idx) => {
          const cat = getCategoryByKey(txn.category);
          return (
            <View key={txn.id} style={[styles.txnRow, idx < recentTransactions.length - 1 && styles.txnBorder, idx < recentTransactions.length - 1 && s.txnBorder]}>
              <View style={[styles.txnIcon, { backgroundColor: (cat?.color ?? '#999') + '20' }]}>
                <Text style={styles.txnEmoji}>{cat?.icon ?? '💸'}</Text>
              </View>
              <View style={styles.txnInfo}>
                <Text style={[styles.txnDesc, s.textPrimary]}>{txn.description}</Text>
                <Text style={[styles.txnDate, s.textSecondary]}>{formatDate(txn.date)}</Text>
              </View>
              <Text style={[styles.txnAmount, s.textPrimary]}>−{format(txn.amount)}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  greeting: { fontSize: 15, marginTop: 4 },
  userName: { fontSize: 24, fontWeight: '700', marginBottom: 16 },

  // Balance card
  balanceCard: {
    borderRadius: 16, padding: 20, marginBottom: 24,
  },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 12 },
  progressBarBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 12 },
  progressBarFill: { height: 6, borderRadius: 3, backgroundColor: '#fff' },
  progressBarDanger: { backgroundColor: '#ff6b6b' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceRight: { alignItems: 'flex-end' },
  balanceSubLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  balanceSubValue: { fontSize: 16, fontWeight: '600', color: '#fff' },

  // Quick actions
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionButton: {
    flex: 1, alignItems: 'center', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 4,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionEmoji: { fontSize: 20 },
  actionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 14 },

  // Category grid
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12, width: '48%' as unknown as number,
    flexGrow: 1, flexBasis: '45%' as unknown as number,
  },
  categoryIcon: { fontSize: 22, marginRight: 10 },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: 13, fontWeight: '600' },
  categoryAmount: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  // Transactions
  transactionsList: { borderRadius: 12, padding: 4, marginBottom: 8 },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
  txnBorder: { borderBottomWidth: 1 },
  txnIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  txnEmoji: { fontSize: 18 },
  txnInfo: { flex: 1 },
  txnDesc: { fontSize: 14, fontWeight: '600' },
  txnDate: { fontSize: 12, marginTop: 2 },
  txnAmount: { fontSize: 14, fontWeight: '700' },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#f5f7fa' },
  balanceCard: { backgroundColor: '#0a7ea4' },
  card: { backgroundColor: '#fff' },
  textPrimary: { color: '#1a1a2e' },
  textSecondary: { color: '#687076' },
  txnBorder: { borderBottomColor: '#f0f0f0' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#151718' },
  balanceCard: { backgroundColor: '#1a3a4a' },
  card: { backgroundColor: '#1e2022' },
  textPrimary: { color: '#ECEDEE' },
  textSecondary: { color: '#9BA1A6' },
  txnBorder: { borderBottomColor: '#2a2d30' },
});
