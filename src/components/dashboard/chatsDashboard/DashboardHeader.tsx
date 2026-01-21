import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import SearchIconHeader from '../../icons/SearchIconHeader';
import SunIconHeader from '../../icons/SunIconHeader';
import { useProject } from '../../../context/ProjectContext';

interface DashboardHeaderProps {
  onSearchChange?: (text: string) => void;
  onThemeToggle?: () => void;
  title: string;
  showCompanyInfo?: boolean;
  companyName?: string;
  balance?: number;
  onAddBalance?: () => void;
  onAccountDropdown?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onSearchChange,
  onThemeToggle,
  title,
  showCompanyInfo = false,
  companyName,
  balance,
  onAddBalance,
  onAccountDropdown,
}) => {
  const { selectedProject } = useProject();
  const displayCompanyName = companyName || selectedProject?.name || 'Company Name';
  const displayBalance = balance !== undefined ? balance : 50.0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {showCompanyInfo ? (
        <View style={styles.rightSection}>
          <Text style={styles.companyName}>{displayCompanyName}</Text>
          <Text style={styles.balance}>₹ {displayBalance.toFixed(2)}</Text>
          <TouchableOpacity onPress={onAddBalance} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAccountDropdown} style={styles.dropdownButton}>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
        </>
      )}
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#155A03',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  dropdownButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
});

export default DashboardHeader;
