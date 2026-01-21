import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const isMobile = () => Dimensions.get('window').width < 768;

interface CreditsBannerProps {
  // These will come from API
  creditsAmount?: number;
  steps?: Array<{
    id: string;
    label: string;
    completed: boolean;
    icon?: string;
  }>;
  show?: boolean;
}

const CreditsBanner: React.FC<CreditsBannerProps> = ({
  creditsAmount = 200,
  steps = [
    { id: '1', label: 'Get your API Live', completed: true },
    { id: '2', label: 'Get FBM Verified', completed: false },
    { id: '3', label: 'Recharge WCC', completed: false },
    { id: '4', label: 'Spend 500 WCC', completed: false },
    { id: '5', label: 'WCC Won', completed: false },
  ],
  show = true,
}) => {
  const mobile = isMobile();

  if (!show) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Complete the steps & Win <Text style={styles.highlight}>{creditsAmount} Credits</Text>{' '}
            WhatsApp Conversation Credits
          </Text>
        </View>
        <View style={styles.coinsIcon}>
          <Text style={styles.coinEmoji}>💰</Text>
        </View>
      </View>

      {/* Progress Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepIcon,
                  step.completed ? styles.stepIconCompleted : styles.stepIconPending,
                ]}
              >
                {step.completed ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={styles.exclamation}>!</Text>
                )}
              </View>
              {!mobile && <Text style={styles.stepLabel}>{step.label}</Text>}
            </View>
            {index < steps.length - 1 && <View style={styles.stepConnector} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#155A03',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
    lineHeight: 24,
  },
  highlight: {
    color: '#F59E0B',
  },
  coinsIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinEmoji: {
    fontSize: 32,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIconCompleted: {
    backgroundColor: '#27AE60',
  },
  stepIconPending: {
    backgroundColor: '#F59E0B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exclamation: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  stepConnector: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
});

export default CreditsBanner;
