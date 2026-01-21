import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BalanceCardProps {
  type: 'Marketing' | 'Utility' | 'Authentication';
  balance: number;
  onAddMore?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ type, balance, onAddMore }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{type}</Text>
      <Text style={styles.balance}>₹ {balance.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddMore}>
        <Text style={styles.addButtonText}>+ Add More</Text>
      </TouchableOpacity>
    </View>
  );
};

interface BalanceCardsProps {
  // These will come from API
  marketingBalance?: number;
  utilityBalance?: number;
  authenticationBalance?: number;
  onAddMore?: (type: 'Marketing' | 'Utility' | 'Authentication') => void;
}

const BalanceCards: React.FC<BalanceCardsProps> = ({
  marketingBalance = 50.0,
  utilityBalance = 50.0,
  authenticationBalance = 50.0,
  onAddMore,
}) => {
  return (
    <View style={styles.container}>
      <BalanceCard
        type="Marketing"
        balance={marketingBalance}
        onAddMore={() => onAddMore?.('Marketing')}
      />
      <BalanceCard
        type="Utility"
        balance={utilityBalance}
        onAddMore={() => onAddMore?.('Utility')}
      />
      <BalanceCard
        type="Authentication"
        balance={authenticationBalance}
        onAddMore={() => onAddMore?.('Authentication')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    gap: 8,
  },
  type: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  balance: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  addButton: {
    backgroundColor: '#155A03',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default BalanceCards;
