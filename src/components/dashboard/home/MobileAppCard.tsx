import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MobileAppCardProps {
  qrCodeValue?: string;
  onGooglePlayPress?: () => void;
  onAppStorePress?: () => void;
}

const MobileAppCard: React.FC<MobileAppCardProps> = ({
  qrCodeValue = 'https://wydely.com/app',
  onGooglePlayPress,
  onAppStorePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan to Download the Mobile App</Text>
      <View style={styles.qrContainer}>
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrPlaceholderText}>QR Code</Text>
          <Text style={styles.qrValueText}>{qrCodeValue}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.storeButton} onPress={onGooglePlayPress}>
          <Text style={styles.storeButtonText}>GET IT ON Google Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.storeButton} onPress={onAppStorePress}>
          <Text style={styles.storeButtonText}>Download on the App Store</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tagline}>Access your dashboard on the go</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAECF0',
    gap: 16,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    textAlign: 'center',
  },
  qrContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  qrPlaceholderText: {
    fontSize: 12,
    color: '#667085',
    fontFamily: 'Albert Sans',
    marginBottom: 4,
  },
  qrValueText: {
    fontSize: 10,
    color: '#98A2B3',
    fontFamily: 'Albert Sans',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 8,
  },
  storeButton: {
    backgroundColor: '#0C111D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  storeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '400',
    color: '#667085',
    fontFamily: 'Albert Sans',
    textAlign: 'center',
  },
});

export default MobileAppCard;
