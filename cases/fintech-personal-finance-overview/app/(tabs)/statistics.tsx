import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import { PieChart } from 'react-native-chart-kit';

export default function StatisticsScreen() {
    const [currency, setCurrency] = useState('USD');
  // Sample data for pie chart
  const pieData = [
    {
      name: 'Food',
      amount: 450,
      color: '#FF6384',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Transport',
      amount: 200,
      color: '#36A2EB',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Shopping',
      amount: 300,
      color: '#FFCE56',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Bills',
      amount: 250,
      color: '#4BC0C0',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Other',
      amount: 150,
      color: '#9966FF',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
  };

  return (
    <View style={styles.container}>
      {/* Spending by Category Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 32}
          height={160}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          center={[0, 0]}
          absolute
        />
      </View>

      {/* Monthly Budget Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Budget</Text>
        <View style={styles.budgetCard}>
          <Text style={styles.budgetText}>Budget: $2,000</Text>
          <Text style={styles.budgetText}>Spent: $1,350</Text>
          <Text style={styles.budgetText}>Remaining: $650</Text>
        </View>
      </View>

      {/* Export Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Data</Text>
        <View style={styles.exportRow}>
          <View style={styles.exportButton}><Text>Export PDF</Text></View>
          <View style={styles.exportButton}><Text>Export CSV</Text></View>
        </View>
      </View>

      {/* Currency Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency</Text>
        <View style={styles.currencySelector}>
          {['USD', 'EUR', 'BYN'].map((cur) => (
            <Text
              key={cur}
              style={[styles.currencyText, currency === cur && styles.selectedCurrency]}
              onPress={() => setCurrency(cur)}
            >
              {cur}
            </Text>
          ))}
        </View>
      </View>

      {/* Authentication Note */}
      <View style={styles.section}>
        <Text style={styles.authNote}>[Authentication Placeholder]</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  // ...removed chartPlaceholder styles...
  budgetCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  budgetText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  exportRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#d1eaff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  currencySelector: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
  },
  currencyText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  selectedCurrency: {
    backgroundColor: '#d1eaff',
    fontWeight: 'bold',
  },
  authNote: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 12,
  },
});
