import React from 'react';
import { ScrollView, StyleSheet, Alert, View, Text } from 'react-native';
import {
  OTPTemplate,
  PromoTemplate,
  QuickRepliesTemplate,
  LinksTemplate,
  MediaTemplate,
} from './templates';

/**
 * TemplatePreviewScreen - Showcase component demonstrating all available template types
 * This is a demo/showcase component, not a page. Use the individual template components
 * from ./templates in your actual UI.
 */
export default function TemplatePreviewScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingVertical: 12 }}>
      {/* OTP Template */}
      <OTPTemplate
        recipientName="Abhinav"
        code="482913"
        expiryMinutes={10}
        timestamp="9:21 PM"
        status="read"
      />

      {/* Promo Template (Image + CTAs) */}
      <PromoTemplate
        imageUri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
        imageHeight={170}
        title="Weekend Deal 🎉"
        body={
          <View>
            <Text style={styles.body}>
              Flat <Text style={{ fontWeight: '900' }}>30% off</Text> on your next booking. Limited
              slots. Order now to get the discount.
            </Text>
            <Text style={styles.body}>Offer valid till 15th January 2026.</Text>
          </View>
        }
        actions={[
          { id: '1', label: 'Book Now', onPress: () => Alert.alert('Book Now') },
          { id: '2', label: 'View Details', onPress: () => Alert.alert('View Details') },
        ]}
        timestamp="9:22 PM"
      />

      {/* Quick Replies Template */}
      <QuickRepliesTemplate
        title="How can I help you today?"
        body="Choose one option:"
        options={[
          { id: '1', label: 'Track Order', onPress: () => Alert.alert('Track Order') },
          { id: '2', label: 'Raise Ticket', onPress: () => Alert.alert('Raise Ticket') },
          { id: '3', label: 'Talk to Agent', onPress: () => Alert.alert('Talk to Agent') },
        ]}
        timestamp="9:23 PM"
        status="delivered"
      />

      {/* Links Template */}
      <LinksTemplate
        title="Documentation 📚"
        body="Here are the quick links you can use:"
        links={[
          {
            id: 'l1',
            title: 'API Reference',
            subtitle: 'Endpoints & Auth',
            url: 'https://example.com/api',
          },
          {
            id: 'l2',
            title: 'Pricing',
            subtitle: 'Plans & Usage',
            url: 'https://example.com/pricing',
          },
        ]}
        timestamp="9:24 PM"
      />

      {/* Media Template */}
      <MediaTemplate
        title="Your media is ready ✅"
        body="Tap a thumbnail to preview or download."
        thumbnails={[
          { id: '1', placeholderColor: '#CBD5E1' },
          { id: '2', placeholderColor: '#CBD5E1' },
          { id: '3', placeholderColor: '#CBD5E1' },
        ]}
        action={{ id: 'g1', label: 'Open Gallery', onPress: () => Alert.alert('Open Gallery') }}
        timestamp="9:25 PM"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F172A',
  },
});
