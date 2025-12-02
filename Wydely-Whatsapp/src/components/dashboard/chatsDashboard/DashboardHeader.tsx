import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import SearchIconHeader from '../../icons/SearchIconHeader';
import SunIconHeader from '../../icons/SunIconHeader';

interface DashboardHeaderProps {
  onSearchChange?: (text: string) => void;
  onThemeToggle?: () => void;
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSearchChange, onThemeToggle, title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.centerSection}>
        <View style={styles.searchContainer}>
          <SearchIconHeader width={16} height={16} color="#667085" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="rgba(28, 28, 28, 0.20)"
            onChangeText={onSearchChange}
          />
        </View>

        <TouchableOpacity onPress={onThemeToggle} style={styles.themeButton}>
          <SunIconHeader width={20} height={20} color="#1C1C1C" />
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 28, 28, 0.10)',
    height: 56,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flex: 1,
    justifyContent: 'center',
  },
  spacer: {
    width: 55,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    minWidth: 294,
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
    padding: 0,
  },
  themeButton: {
    padding: 0,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardHeader;
