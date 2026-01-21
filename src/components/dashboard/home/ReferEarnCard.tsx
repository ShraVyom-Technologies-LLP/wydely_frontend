import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';

interface ReferEarnCardProps {
  // These will come from API
  referralLink?: string;
  earningsAmount?: number;
  pointsPerSignup?: number;
  onCopyLink?: (link: string) => void;
}

const ReferEarnCard: React.FC<ReferEarnCardProps> = ({
  referralLink = 'https://abdulahad.com/learn/ahad',
  earningsAmount = 2000,
  pointsPerSignup = 50,
  onCopyLink,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (Platform.OS === 'web' && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
    }
    setCopied(true);
    onCopyLink?.(referralLink);
    setTimeout(() => setCopied(false), 2000);
  };

  const details = [
    { icon: '🔗', text: 'Share the link' },
    { icon: '👤', text: 'Your friend gets free access for 7 days' },
    { icon: '💰', text: `You earn ${pointsPerSignup} points for each successful sign-up` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💰</Text>
      </View>
      <Text style={styles.title}>Refer & Earn</Text>
      <Text style={styles.description}>
        Share your referral with your friend & earn ₹ {earningsAmount}
      </Text>
      <View style={styles.detailsContainer}>
        {details.map((detail, index) => (
          <View key={index} style={styles.detailItem}>
            <Text style={styles.detailIcon}>{detail.icon}</Text>
            <Text style={styles.detailText}>{detail.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.linkContainer}>
        <View style={styles.linkInput}>
          <Text style={styles.linkText} numberOfLines={1}>
            {referralLink}
          </Text>
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1FAE5',
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
  detailsContainer: {
    gap: 8,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  linkInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  copyButton: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'Albert Sans',
  },
});

export default ReferEarnCard;
