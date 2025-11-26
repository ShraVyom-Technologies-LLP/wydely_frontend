import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showInfo?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  showInfo,
}) => (
  <View style={styles.radioGroup}>
    <View style={styles.radioLabelContainer}>
      <Text style={styles.radioLabel}>
        {label}
        <Text style={styles.required}>*</Text>
      </Text>
      {showInfo && (
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>i</Text>
        </View>
      )}
    </View>
    <View style={styles.radioOptionsContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.radioOption,
            selectedValue === option.value && styles.radioOptionSelected,
            index > 0 && styles.radioOptionSpacing,
          ]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <View style={styles.radioButton}>
            {selectedValue === option.value && <View style={styles.radioButtonInner} />}
          </View>
          <Text
            style={[
              styles.radioOptionText,
              selectedValue === option.value && styles.radioOptionTextSelected,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const BroadcastCampaignPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [campaignName, setCampaignName] = useState('');
  const [lastSeen, setLastSeen] = useState('in24hr');
  const [createdAt, setCreatedAt] = useState('today');
  const [optedIn, setOptedIn] = useState('yes');
  const [incomingBlocked, setIncomingBlocked] = useState('yes');
  const [readStatus, setReadStatus] = useState('read');

  const lastSeenOptions: RadioOption[] = [
    { label: 'In 24hr', value: 'in24hr' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Custom', value: 'custom' },
  ];

  const createdAtOptions: RadioOption[] = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Custom', value: 'custom' },
  ];

  const optedInOptions: RadioOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'All', value: 'all' },
  ];

  const incomingBlockedOptions: RadioOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'All', value: 'all' },
  ];

  const readStatusOptions: RadioOption[] = [
    { label: 'Read', value: 'read' },
    { label: 'Unread', value: 'unread' },
    { label: 'All', value: 'all' },
  ];

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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <View style={styles.content}>
          {/* Campaign Type Badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeLabel}>Campaign Type:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Broadcast Campaign</Text>
            </View>
          </View>

          {/* Campaign Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Campaign Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Campaign Name<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Campaign Name"
                placeholderTextColor="#98A2B3"
                value={campaignName}
                onChangeText={setCampaignName}
              />
            </View>
          </View>

          {/* Create Audience Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create Audience</Text>
            <View style={styles.formContent}>
              <RadioGroup
                label="Last Seen"
                options={lastSeenOptions}
                selectedValue={lastSeen}
                onSelect={setLastSeen}
              />
              <RadioGroup
                label="Created at"
                options={createdAtOptions}
                selectedValue={createdAt}
                onSelect={setCreatedAt}
              />
              <RadioGroup
                label="Opted In"
                options={optedInOptions}
                selectedValue={optedIn}
                onSelect={setOptedIn}
                showInfo
              />
              <RadioGroup
                label="Incoming Blocked"
                options={incomingBlockedOptions}
                selectedValue={incomingBlocked}
                onSelect={setIncomingBlocked}
                showInfo
              />
              <RadioGroup
                label="Read Status"
                options={readStatusOptions}
                selectedValue={readStatus}
                onSelect={setReadStatus}
                showInfo
              />
            </View>
          </View>

          {/* Create Message Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create Message</Text>
            <View style={styles.formContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Template<Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
                  <Text style={styles.dropdownPlaceholder}>-Select-</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Preview</Text>
                <View style={styles.previewBox}>
                  <Text style={styles.previewText}>
                    Hi User,{'\n\n'}
                    Thanks for subscribing to our WhatsApp Newsletter.{'\n\n'}
                    Stay tuned for more updates, trends and tactics of the latest Shravyom Marketing
                    trends in the industry.{'\n\n'}
                    Best Regards,{'\n'}
                    Shravyom Technologies
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.backButtonAction}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewButton} activeOpacity={0.7}>
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
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
    // Important for web so nested ScrollView can actually scroll
    // inside column layouts
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
    gap: 6,
    justifyContent: 'center',
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
  formContent: {
    gap: 24,
  },
  inputContainer: {
    gap: 12,
    marginBottom: 24,
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
  input: {
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
  radioGroup: {
    gap: 12,
    marginBottom: 24,
  },
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EAECF0',
    borderWidth: 1,
    borderColor: '#667085',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#667085',
  },
  radioOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  radioOption: {
    flex: 1,
    minWidth: 100,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  radioOptionSpacing: {
    marginLeft: 0,
  },
  radioOptionSelected: {
    backgroundColor: 'rgba(218, 237, 213, 0.5)',
    borderColor: '#104502',
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#D9DBE9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#104502',
  },
  radioOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475467',
    fontFamily: 'Albert Sans',
  },
  radioOptionTextSelected: {
    color: '#0C111D',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    fontFamily: 'Albert Sans',
    color: '#98A2B3',
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#A0A3BD',
  },
  previewBox: {
    backgroundColor: '#FCFCFD',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    padding: 16,
    minHeight: 228,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  previewButton: {
    backgroundColor: '#155A03',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 6,
    height: 36,
    width: 168,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default BroadcastCampaignPage;
