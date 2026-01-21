import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UpgradeProCardProps {
  onExplorePlans?: () => void;
}

const UpgradeProCard: React.FC<UpgradeProCardProps> = ({ onExplorePlans }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#155A03', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <Text style={styles.title}>Upgrade to PRO to get access all Features!</Text>
        <TouchableOpacity style={styles.button} onPress={onExplorePlans}>
          <Text style={styles.buttonText}>Explore Plans</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  gradientContainer: {
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0D3C02',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default UpgradeProCard;
