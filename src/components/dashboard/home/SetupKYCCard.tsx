import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SetupKYCCardProps {
  // These will come from API
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
  stepNumber?: number;
  onStartKYC?: () => void;
  show?: boolean;
}

const SetupKYCCard: React.FC<SetupKYCCardProps> = ({
  status = 'PENDING',
  stepNumber = 2,
  onStartKYC,
  show = true,
}) => {
  if (!show) return null;
  const requirements = [
    'Complete your KYC to boost your messaging limit to 2000 and display name approval',
    'Legal/Trade Name on GST Certificate and Facebook Business Manager should match',
    'Ensure you have an active website prior to applying for KYC',
    "Use director's Aadhaar card listed on your GST document",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepNumber}>{stepNumber}</Text>
        </View>
        {status === 'PENDING' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>PENDING</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>
        Increase your messaging limit & get your display name approved.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onStartKYC}>
        <Text style={styles.buttonText}>Start KYC →</Text>
      </TouchableOpacity>

      <View style={styles.requirementsContainer}>
        {requirements.map((req, index) => (
          <View key={index} style={styles.requirementItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirementText}>{req}</Text>
          </View>
        ))}
      </View>

      {/* Background decorative element */}
      <View style={styles.decorativeCircle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAECF0',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
    fontFamily: 'Albert Sans',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C111D',
    marginBottom: 16,
    fontFamily: 'Albert Sans',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#155A03',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  requirementsContainer: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  decorativeCircle: {
    position: 'absolute',
    right: -50,
    bottom: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F9FAFB',
    opacity: 0.5,
  },
});

export default SetupKYCCard;
