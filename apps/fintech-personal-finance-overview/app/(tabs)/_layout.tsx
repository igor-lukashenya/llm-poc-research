import { Tabs } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { useThemeMode, type ThemeMode } from '@/hooks/use-theme-mode';

const themeOptions: { key: ThemeMode; label: string; icon: string }[] = [
  { key: 'light', label: 'Light', icon: '☀️' },
  { key: 'dark', label: 'Dark', icon: '🌙' },
  { key: 'system', label: 'System', icon: '⚙️' },
];

function AuthBadge() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const { mode, setMode } = useThemeMode();
  const isDark = colorScheme === 'dark';
  const [menuVisible, setMenuVisible] = useState(false);
  const [badgeLayout, setBadgeLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const badgeRef = useRef<View>(null);

  const handlePress = () => {
    badgeRef.current?.measureInWindow((x, y, width, height) => {
      setBadgeLayout({ x, y, width, height });
      setMenuVisible(true);
    });
  };

  const handleSelectTheme = (key: ThemeMode) => {
    setMode(key);
    setMenuVisible(false);
  };

  return (
    <>
      <Pressable ref={badgeRef} onPress={handlePress} style={badgeStyles.container}>
        <View style={[badgeStyles.avatar, isDark && badgeStyles.avatarDark]}>
          <Text style={badgeStyles.avatarText}>{user.avatar}</Text>
        </View>
        <View>
          <Text style={[badgeStyles.name, isDark && badgeStyles.nameDark]}>{user.name}</Text>
          <Text style={[badgeStyles.status, isDark && badgeStyles.statusDark]}>✓ Authenticated</Text>
        </View>
      </Pressable>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={badgeStyles.overlay} onPress={() => setMenuVisible(false)}>
          <View
            style={[
              badgeStyles.dropdown,
              isDark && badgeStyles.dropdownDark,
              { top: badgeLayout.y + badgeLayout.height + 6, right: 12 },
            ]}
          >
            <Text style={[badgeStyles.dropdownHeader, isDark && badgeStyles.dropdownHeaderDark]}>
              {user.email}
            </Text>
            <View style={[badgeStyles.divider, isDark && badgeStyles.dividerDark]} />
            <Text style={[badgeStyles.dropdownLabel, isDark && badgeStyles.dropdownLabelDark]}>Theme</Text>
            {themeOptions.map((opt) => (
              <Pressable
                key={opt.key}
                style={[badgeStyles.dropdownItem, mode === opt.key && badgeStyles.dropdownItemActive, mode === opt.key && isDark && badgeStyles.dropdownItemActiveDark]}
                onPress={() => handleSelectTheme(opt.key)}
              >
                <Text style={badgeStyles.dropdownItemIcon}>{opt.icon}</Text>
                <Text style={[badgeStyles.dropdownItemText, isDark && badgeStyles.dropdownItemTextDark]}>
                  {opt.label}
                </Text>
                {mode === opt.key && <Text style={badgeStyles.checkmark}>✓</Text>}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const badgeStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 12 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#0a7ea4', alignItems: 'center', justifyContent: 'center',
  },
  avatarDark: { backgroundColor: '#1a8cb8' },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  name: { fontSize: 13, fontWeight: '600', color: '#333' },
  nameDark: { color: '#eee' },
  status: { fontSize: 11, color: '#43a047' },
  statusDark: { color: '#66bb6a' },

  // Dropdown overlay & menu
  overlay: { flex: 1 },
  dropdown: {
    position: 'absolute', width: 200, backgroundColor: '#fff',
    borderRadius: 12, paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12,
    elevation: 8,
  },
  dropdownDark: { backgroundColor: '#2a2d30' },
  dropdownHeader: { fontSize: 12, color: '#888', paddingHorizontal: 14, paddingVertical: 4 },
  dropdownHeaderDark: { color: '#9BA1A6' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },
  dividerDark: { backgroundColor: '#3a3d40' },
  dropdownLabel: { fontSize: 11, fontWeight: '700', color: '#999', paddingHorizontal: 14, paddingTop: 4, paddingBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  dropdownLabelDark: { color: '#777' },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, gap: 8,
  },
  dropdownItemActive: { backgroundColor: '#e8f4fd' },
  dropdownItemActiveDark: { backgroundColor: '#1a3a4a' },
  dropdownItemIcon: { fontSize: 16 },
  dropdownItemText: { flex: 1, fontSize: 14, color: '#333' },
  dropdownItemTextDark: { color: '#eee' },
  checkmark: { fontSize: 14, color: '#0a7ea4', fontWeight: '700' },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerRight: () => <AuthBadge />,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.pie.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Deals',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tag.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
