import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

interface DealCard {
  id: string;
  store: string;
  logo: string;
  discount: string;
  description: string;
  validUntil: string;
  color: string;
  category: 'grocery' | 'dining' | 'fuel' | 'shopping' | 'travel';
}

const deals: DealCard[] = [
  { id: '1', store: 'Whole Foods', logo: '🥦', discount: '5% cashback', description: 'On all grocery purchases over $50', validUntil: 'Jun 30', color: '#2e7d32', category: 'grocery' },
  { id: '2', store: 'Shell Gas', logo: '⛽', discount: '10¢/gal off', description: 'Save on every gallon at Shell stations', validUntil: 'May 31', color: '#e65100', category: 'fuel' },
  { id: '3', store: 'Amazon', logo: '📦', discount: '3% cashback', description: 'On all Amazon.com purchases', validUntil: 'Dec 31', color: '#ff9800', category: 'shopping' },
  { id: '4', store: 'Starbucks', logo: '☕', discount: '2× points', description: 'Double rewards on coffee & food', validUntil: 'Jul 15', color: '#1b5e20', category: 'dining' },
  { id: '5', store: 'Target', logo: '🎯', discount: '10% off', description: 'Exclusive discount on home essentials', validUntil: 'May 20', color: '#c62828', category: 'shopping' },
  { id: '6', store: 'Uber Eats', logo: '🍔', discount: '$5 off', description: 'On orders above $25', validUntil: 'Jun 10', color: '#212121', category: 'dining' },
  { id: '7', store: 'Delta Airlines', logo: '✈️', discount: '2× miles', description: 'Earn double miles on all bookings', validUntil: 'Sep 30', color: '#0d47a1', category: 'travel' },
  { id: '8', store: 'CVS Pharmacy', logo: '💊', discount: '8% cashback', description: 'On health & wellness products', validUntil: 'Aug 15', color: '#ad1457', category: 'grocery' },
  { id: '9', store: 'Nike', logo: '👟', discount: '15% off', description: 'Sitewide discount for cardholders', validUntil: 'Jul 31', color: '#333', category: 'shopping' },
  { id: '10', store: 'Costco', logo: '🏪', discount: '4% cashback', description: 'On all Costco warehouse purchases', validUntil: 'Dec 31', color: '#1565c0', category: 'grocery' },
];

const categoryFilters = [
  { key: 'all', label: 'All', icon: '🔥' },
  { key: 'grocery', label: 'Grocery', icon: '🛒' },
  { key: 'dining', label: 'Dining', icon: '🍽️' },
  { key: 'fuel', label: 'Fuel', icon: '⛽' },
  { key: 'shopping', label: 'Shopping', icon: '🛍️' },
  { key: 'travel', label: 'Travel', icon: '✈️' },
];

export default function DealsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const s = isDark ? darkStyles : lightStyles;

  const [filter, setFilter] = React.useState('all');

  const filtered = filter === 'all' ? deals : deals.filter((d) => d.category === filter);

  return (
    <ScrollView style={[styles.container, s.container]} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={[styles.pageTitle, s.textPrimary]}>Deals & Discounts</Text>
      <Text style={[styles.pageSubtitle, s.textSecondary]}>
        Exclusive offers from your linked cards
      </Text>

      {/* Category filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {categoryFilters.map((cat) => (
          <Pressable
            key={cat.key}
            style={[styles.filterChip, s.card, filter === cat.key && styles.filterChipActive]}
            onPress={() => setFilter(cat.key)}
          >
            <Text style={styles.filterIcon}>{cat.icon}</Text>
            <Text style={[styles.filterLabel, s.textSecondary, filter === cat.key && styles.filterLabelActive]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Linked Cards */}
      <Text style={[styles.sectionTitle, s.textPrimary]}>Your Cards</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cardsRow}>
        <View style={[styles.creditCard, { backgroundColor: '#1a237e' }]}>  
          <Text style={styles.cardType}>VISA</Text>
          <Text style={styles.cardNumber}>•••• •••• •••• 4582</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardName}>JOHN DOE</Text>
            <Text style={styles.cardExpiry}>09/27</Text>
          </View>
        </View>
        <View style={[styles.creditCard, { backgroundColor: '#b71c1c' }]}>  
          <Text style={styles.cardType}>MASTERCARD</Text>
          <Text style={styles.cardNumber}>•••• •••• •••• 8901</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardName}>JOHN DOE</Text>
            <Text style={styles.cardExpiry}>03/28</Text>
          </View>
        </View>
        <View style={[styles.creditCard, { backgroundColor: '#004d40' }]}>  
          <Text style={styles.cardType}>AMEX</Text>
          <Text style={styles.cardNumber}>•••• •••••• •3456</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardName}>JOHN DOE</Text>
            <Text style={styles.cardExpiry}>12/26</Text>
          </View>
        </View>
      </ScrollView>

      {/* Deal Cards */}
      <Text style={[styles.sectionTitle, s.textPrimary]}>
        {filter === 'all' ? 'All Offers' : `${categoryFilters.find((c) => c.key === filter)?.label} Offers`}
        <Text style={[styles.dealCount, s.textSecondary]}> ({filtered.length})</Text>
      </Text>

      {filtered.map((deal) => (
        <Pressable key={deal.id} style={[styles.dealCard, s.card]}>
          <View style={[styles.dealLogo, { backgroundColor: deal.color + '18' }]}>
            <Text style={styles.dealEmoji}>{deal.logo}</Text>
          </View>
          <View style={styles.dealInfo}>
            <Text style={[styles.dealStore, s.textPrimary]}>{deal.store}</Text>
            <Text style={[styles.dealDescription, s.textSecondary]}>{deal.description}</Text>
            <Text style={[styles.dealExpiry, s.textSecondary]}>Valid until {deal.validUntil}</Text>
          </View>
          <View style={[styles.dealBadge, { backgroundColor: deal.color }]}>
            <Text style={styles.dealBadgeText}>{deal.discount}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  pageSubtitle: { fontSize: 14, marginTop: 4, marginBottom: 16 },

  // Filters
  filterScroll: { marginBottom: 20 },
  filterRow: { gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, gap: 4,
  },
  filterChipActive: { backgroundColor: '#0a7ea4' },
  filterIcon: { fontSize: 14 },
  filterLabel: { fontSize: 13, fontWeight: '600' },
  filterLabelActive: { color: '#fff' },

  // Credit cards
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  cardsScroll: { marginBottom: 24 },
  cardsRow: { gap: 12 },
  creditCard: {
    width: 260, height: 150, borderRadius: 14, padding: 18,
    justifyContent: 'space-between',
  },
  cardType: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  cardNumber: { color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: '600', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardName: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  cardExpiry: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },

  // Deals
  dealCount: { fontSize: 14, fontWeight: '400' },
  dealCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    padding: 12, marginBottom: 10, gap: 12,
  },
  dealLogo: {
    width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  dealEmoji: { fontSize: 22 },
  dealInfo: { flex: 1 },
  dealStore: { fontSize: 15, fontWeight: '700' },
  dealDescription: { fontSize: 12, marginTop: 2 },
  dealExpiry: { fontSize: 11, marginTop: 3 },
  dealBadge: {
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8,
  },
  dealBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#f5f7fa' },
  card: { backgroundColor: '#fff' },
  textPrimary: { color: '#1a1a2e' },
  textSecondary: { color: '#687076' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#151718' },
  card: { backgroundColor: '#1e2022' },
  textPrimary: { color: '#ECEDEE' },
  textSecondary: { color: '#9BA1A6' },
});
