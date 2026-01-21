import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TrainingCallCardProps {
  onScheduleCall?: () => void;
}

const TrainingCallCard: React.FC<TrainingCallCardProps> = ({ onScheduleCall }) => {
  const benefits = [
    'Get a guided walkthrough of the platform',
    'Learn how to submit templates, upload contacts, and send broadcasts',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💡</Text>
      </View>
      <Text style={styles.title}>Wydely Training Call</Text>
      <Text style={styles.description}>Book your platform onboarding session with our team.</Text>
      <View style={styles.benefitsContainer}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onScheduleCall}>
        <Text style={styles.buttonText}>Schedule Call Now →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 20,
    gap: 12,
    width: '100%',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  benefitsContainer: {
    gap: 8,
    marginTop: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default TrainingCallCard;
