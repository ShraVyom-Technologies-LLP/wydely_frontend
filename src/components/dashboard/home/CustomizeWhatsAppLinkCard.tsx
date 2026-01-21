import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomizeWhatsAppLinkCardProps {
  onCreateNow?: () => void;
}

const CustomizeWhatsAppLinkCard: React.FC<CustomizeWhatsAppLinkCardProps> = ({ onCreateNow }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔗</Text>
      </View>
      <Text style={styles.title}>Customize WhatsApp Link</Text>
      <Text style={styles.description}>
        Create shareable links & QR for your WA business number
      </Text>
      <TouchableOpacity style={styles.button} onPress={onCreateNow}>
        <Text style={styles.buttonText}>Create Now →</Text>
      </TouchableOpacity>
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
    gap: 12,
    width: '100%',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
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
  button: {
    backgroundColor: '#155A03',
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

export default CustomizeWhatsAppLinkCard;
