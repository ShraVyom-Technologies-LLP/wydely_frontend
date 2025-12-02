import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PreviewRouteProp = RouteProp<RootStackParamList, 'BroadcastCampaignPreview'>;

const BroadcastCampaignPreviewPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewRouteProp>();
  const { campaignName, templateName, templateContent, audienceSize } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} />
          <Text style={styles.headerTitle}>Campaigns</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Campaign Type Badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeLabel}>Campaign Type:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Broadcast Campaign</Text>
            </View>
          </View>

          {/* Main Preview Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview Message</Text>

            {/* Campaign name & audience size */}
            <View style={styles.topRow}>
              <View style={styles.inputColumn}>
                <Text style={styles.inputLabel}>
                  Campaign Name<Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.valuePill}>
                  <Text style={styles.valuePillText}>{campaignName || '-'}</Text>
                </View>
              </View>

              <View style={styles.inputColumn}>
                <Text style={styles.inputLabel}>
                  Audience Size<Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.valuePill}>
                  <Text style={styles.valuePillText}>
                    {typeof audienceSize === 'number' ? audienceSize : audienceSize || '-'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Message Preview */}
            <View style={styles.messagePreviewSection}>
              <Text style={styles.inputLabel}>Message Preview</Text>

              <View style={styles.messagePreviewRow}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.messageCard}>
                  <Text style={styles.messageCardText}>{templateContent || templateName}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.dashedDivider} />

            {/* Test your campaign */}
            <View style={styles.testSection}>
              <View style={styles.testHeaderRow}>
                <Text style={styles.testTitle}>Test your Campaign</Text>
              </View>

              <View style={styles.testInputsRow}>
                <View style={styles.testInputColumn}>
                  <TextInput
                    style={styles.testInput}
                    placeholder="Enter Username"
                    placeholderTextColor="#98A2B3"
                  />
                </View>

                <View style={styles.testInputColumn}>
                  <View style={styles.phoneInputWrapper}>
                    <Text style={styles.phoneCode}>+91</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Enter WhatsApp Number"
                      placeholderTextColor="#98A2B3"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.sendButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Placeholder interaction for now
                    // eslint-disable-next-line no-console
                    console.log('Test campaign send tapped');
                  }}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                  <Text style={styles.sendButtonIcon}>→</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.dashedDivider} />

            {/* Cost summary */}
            <View style={styles.costRow}>
              <View style={styles.costColumn}>
                <Text style={styles.costLabel}>Estimated cost:</Text>
                <Text style={styles.costValue}>₹ 0.88</Text>
              </View>
              <View style={styles.costColumn}>
                <Text style={styles.costLabel}>Available WCC:</Text>
                <Text style={styles.costValuePositive}>₹ 50</Text>
              </View>
            </View>

            {/* Footer actions */}
            <View style={styles.sectionFooter}>
              <TouchableOpacity
                style={styles.backButtonAction}
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.launchButton}
                activeOpacity={0.8}
                onPress={() => {
                  // Placeholder for launching campaign
                  // eslint-disable-next-line no-console
                  console.log('Launch campaign tapped');
                }}
              >
                <Text style={styles.launchButtonText}>Launch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC',
    minHeight: 0,
  },
  pageHeader: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 28, 28, 0.1)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 100,
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 32,
  },
  badgeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    lineHeight: 32,
  },
  badge: {
    backgroundColor: '#A98CFF',
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    lineHeight: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 48,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    lineHeight: 34,
    marginBottom: 32,
  },
  topRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  inputColumn: {
    flex: 1,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  required: {
    color: '#FF0004',
  },
  valuePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 0,
    paddingVertical: 8,
    justifyContent: 'center',
    height: 40,
  },
  valuePillText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  messagePreviewSection: {
    gap: 12,
    marginBottom: 24,
  },
  messagePreviewRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },
  messageCard: {
    backgroundColor: '#DCE6FF',
    borderRadius: 12,
    padding: 12,
    maxWidth: '100%',
  },
  messageCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#D0D5DD',
    borderStyle: 'dashed',
    marginVertical: 24,
  },
  testSection: {
    gap: 16,
  },
  testHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  testInputsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  testInputColumn: {
    flex: 1,
  },
  testInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Albert Sans',
    color: '#0C111D',
    height: 44,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    gap: 8,
  },
  phoneCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Albert Sans',
    color: '#0C111D',
  },
  sendButton: {
    backgroundColor: '#155A03',
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  sendButtonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  costRow: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#F5F7F9',
    borderRadius: 10,
    padding: 16,
  },
  costColumn: {
    flex: 1,
    gap: 8,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  costValuePositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00AA6C',
    fontFamily: 'Albert Sans',
  },
  sectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D0D5DD',
  },
  backButtonAction: {
    borderWidth: 1,
    borderColor: '#344054',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 6,
    height: 36,
    width: 168,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  launchButton: {
    backgroundColor: '#155A03',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 6,
    height: 36,
    width: 168,
    justifyContent: 'center',
    alignItems: 'center',
  },
  launchButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default BroadcastCampaignPreviewPage;
