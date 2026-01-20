import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import colors from '../theme/colors';
import ApiService, { TemplateOption } from '../services/api';
import { useToast } from '../context/ToastContext';
const api = new ApiService();

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateCampaignSidePanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [isExcludeOptedOutEnabled, setIsExcludeOptedOutEnabled] = useState(false);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const { showToast } = useToast();

  const fetchTemplates = async (): Promise<TemplateOption[]> => {
    const response = await api.getExistingTemplates();
    if (!response.success) {
      showToast({
        type: 'error',
        title: 'Something went wrong!',
        message: response.error || 'Unable to fetch templates. Please try again later.',
      });
      return [];
    }
    return response.data ?? [];
  };

  useEffect(() => {
    let isMounted = true;
    fetchTemplates()
      .then((data) => {
        if (isMounted) {
          setTemplates(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load templates:', error);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) || null;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 1 : 0,
      duration: isOpen ? 250 : 200,
      easing: isOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  const panelTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [520, 0],
  });

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      pointerEvents={isOpen ? 'auto' : 'none'}
      style={[styles.sidePanelOverlay, { opacity: overlayOpacity }]}
    >
      <Animated.View
        style={[
          styles.sidePanel,
          {
            transform: [{ translateX: panelTranslateX }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.sidePanelHeader}>
          <TouchableOpacity onPress={onClose} style={styles.sidePanelCloseButton}>
            <Text style={styles.sidePanelCloseIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.sidePanelTitle}>Create Campaign</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.sidePanelScroll}
          contentContainerStyle={styles.sidePanelScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sidePanelContent}>
            {/* Campaign Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Campaign Name<Text style={styles.fieldRequired}>*</Text>
              </Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Enter Campaign Name"
                placeholderTextColor="#98A2B3"
              />
            </View>

            {/* Template select */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Template<Text style={styles.fieldRequired}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={0.7}
                onPress={() => setIsTemplateDropdownOpen((prev) => !prev)}
              >
                {selectedTemplate ? (
                  <Text style={styles.templateName}>{selectedTemplate.title}</Text>
                ) : (
                  <Text style={styles.dropdownPlaceholder}>-Select-</Text>
                )}
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {isTemplateDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {templates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.dropdownItem,
                        selectedTemplateId === template.id && styles.dropdownItemSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedTemplateId(template.id);
                        setIsTemplateDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedTemplateId === template.id && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {template.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {templates.length === 0 && (
                    <View style={styles.dropdownEmpty}>
                      <Text style={styles.dropdownEmptyText}>No templates available</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Preview */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Preview</Text>
              <Text style={[styles.fieldInput, styles.previewInput]}>
                {selectedTemplate ? selectedTemplate.message : ''}
              </Text>
            </View>

            {/* Schedule Date and Time toggle */}
            <View style={styles.sectionGroup}>
              <TouchableOpacity
                style={styles.toggleRow}
                activeOpacity={0.8}
                onPress={() => setIsScheduleEnabled((prev) => !prev)}
              >
                <View style={[styles.toggleSwitch, isScheduleEnabled && styles.toggleSwitchOn]}>
                  <View style={[styles.toggleThumb, isScheduleEnabled && styles.toggleThumbOn]} />
                </View>
                <Text style={styles.toggleLabel}>Schedule Date and Time</Text>
              </TouchableOpacity>

              {isScheduleEnabled && (
                <>
                  <Text style={styles.fieldLabelInline}>
                    Start Date &amp; Time
                    <Text style={styles.fieldRequired}>*</Text>
                  </Text>
                  <View style={styles.startDateRow}>
                    <View style={styles.startDateCol}>
                      <View style={styles.selectInput}>
                        <Text style={styles.selectPlaceholder}>Select Start Date</Text>
                      </View>
                    </View>
                    <View style={styles.startDateCol}>
                      <View style={styles.selectInput}>
                        <Text style={styles.selectPlaceholder}>Select Start Time</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Exclude Opted-out data */}
            <View style={styles.sectionGroup}>
              <TouchableOpacity
                style={styles.excludeRow}
                activeOpacity={0.8}
                onPress={() => setIsExcludeOptedOutEnabled((prev) => !prev)}
              >
                <View
                  style={[styles.toggleSwitch, isExcludeOptedOutEnabled && styles.toggleSwitchOn]}
                >
                  <View
                    style={[styles.toggleThumb, isExcludeOptedOutEnabled && styles.toggleThumbOn]}
                  />
                </View>
                <View style={styles.excludeTextContainer}>
                  <Text style={styles.excludeTitle}>Exclude Opted-out data</Text>
                  <Text style={styles.excludeDescription}>
                    Skip users who have opted out from future campaign
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Test section group with dashed separators */}
            <View style={styles.testSection}>
              <View style={styles.testDividerTop} />

              {/* Test your Campaign row */}
              <View style={styles.testRow}>
                <Text style={styles.testLabel}>Test your Campaign</Text>
                <View style={styles.testInputsRow}>
                  <View style={styles.testInputWrapper}>
                    <TextInput
                      style={styles.testInput}
                      placeholder="Enter Username"
                      placeholderTextColor="#98A2B3"
                    />
                  </View>
                  <View style={styles.testInputWrapper}>
                    <TextInput
                      style={styles.testInput}
                      placeholder="+91 Enter WhatsApp Number"
                      placeholderTextColor="#98A2B3"
                    />
                  </View>
                  <TouchableOpacity style={styles.testSendButton}>
                    <Text style={styles.testSendButtonText}>Send →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.testDividerBottom} />

              {/* Estimated cost row */}
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
            </View>
          </View>
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.sidePanelFooter}>
          <TouchableOpacity style={styles.footerCancelButton} onPress={onClose}>
            <Text style={styles.footerCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerPrimaryButton}>
            <Text style={styles.footerPrimaryText}>
              {isScheduleEnabled ? 'Schedule' : 'Launch'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidePanelOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  sidePanel: {
    width: 900,
    maxWidth: '100%',
    height: '100%',
    backgroundColor: '#F9FBFC',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: -8, height: 0 },
    elevation: 8,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sidePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  sidePanelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  sidePanelCloseButton: {
    padding: 4,
  },
  sidePanelCloseIcon: {
    fontSize: 20,
    color: colors.text,
  },
  sidePanelScroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sidePanelScrollContent: {
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 8,
    gap: 24,
  },
  sidePanelContent: {
    gap: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
  },
  fieldGroup: {
    width: '100%',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fieldRequired: {
    color: colors.error,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  previewInput: {
    minHeight: 180,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 44,
  },
  selectPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectChevron: {
    fontSize: 16,
    color: colors.textLight,
  },
  sectionGroup: {
    gap: 12,
    marginTop: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  toggleSwitch: {
    width: 40,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#D0D5DD',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  toggleSwitchOn: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: 0 }],
  },
  toggleThumbOn: {
    transform: [{ translateX: 16 }],
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fieldLabelInline: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  startDateRow: {
    flexDirection: 'row',
    gap: 16,
  },
  startDateCol: {
    flex: 1,
  },
  excludeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  excludeTextContainer: {
    flex: 1,
  },
  excludeTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  excludeDescription: {
    fontSize: 12,
    color: colors.textMuted,
  },
  testSection: {
    gap: 16,
  },
  testDividerTop: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D0D5DD',
    marginVertical: 12,
  },
  testDividerBottom: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D0D5DD',
    marginTop: 12,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
  },
  testLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  testInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  testInputWrapper: {
    flex: 1,
  },
  testInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    width: 215,
  },
  testSendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
    width: 100,
    alignItems: 'center',
  },
  testSendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  costRow: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F7F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  costColumn: {
    flex: 1,
    gap: 8,
  },
  costValuePositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00AA6C',
    fontFamily: 'Albert Sans',
  },
  sidePanelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D0D5DD',
  },
  footerCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#344054',
    minWidth: 168,
    alignItems: 'center',
  },
  footerCancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerPrimaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    minWidth: 168,
    alignItems: 'center',
  },
  footerPrimaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
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
    color: colors.textLight,
    backgroundColor: '#FFFFFF',
  },
  templateName: {
    fontSize: 14,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#A0A3BD',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(218, 237, 213, 0.5)',
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Albert Sans',
    color: '#344054',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#104502',
  },
  dropdownEmpty: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownEmptyText: {
    fontSize: 12,
    fontFamily: 'Albert Sans',
    color: '#98A2B3',
  },
});

export default CreateCampaignSidePanel;
