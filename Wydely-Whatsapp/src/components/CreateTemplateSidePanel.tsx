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
import { apiService, TemplateOption } from '../services/api';
import { useApiCall } from '../hooks/useApiCall';
import CloseIcon from './icons/CloseIcon';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated?: () => void;
};

type TemplateType = 'TEXT' | 'IMAGE' | 'BUTTON';
type TemplateCategory = string;

interface SampleValue {
  placeholder: string;
  value: string;
}

const CreateTemplateSidePanel: React.FC<Props> = ({ isOpen, onClose, onTemplateCreated }) => {
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState<TemplateType>('TEXT');
  const [templateFormat, setTemplateFormat] = useState('');
  const [templateFooter, setTemplateFooter] = useState('');
  const [sampleValues, setSampleValues] = useState<SampleValue[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const templateCategories: TemplateCategory[] = [
    'General',
    'Ecommerce',
    'Education',
    'Banking',
    'Healthcare',
    'Travel',
  ];

  const templateTypes: TemplateType[] = ['TEXT', 'IMAGE', 'BUTTON'];

  // Extract placeholders from template format (e.g., [[1]], [[2]], [[name]])
  useEffect(() => {
    const placeholderRegex = /\[\[(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\]\]/g;
    const matches = Array.from(templateFormat.matchAll(placeholderRegex));
    const uniquePlaceholders = Array.from(new Set(matches.map((match) => match[1]))).sort(
      (a, b) => {
        // Sort numeric placeholders first, then alphabetical
        const aNum = parseInt(a, 10);
        const bNum = parseInt(b, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        if (!isNaN(aNum)) return -1;
        if (!isNaN(bNum)) return 1;
        return a.localeCompare(b);
      }
    );

    const newSampleValues: SampleValue[] = uniquePlaceholders.map((placeholder) => {
      const existing = sampleValues.find((sv) => sv.placeholder === placeholder);
      return {
        placeholder,
        value: existing?.value || '',
      };
    });

    setSampleValues(newSampleValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateFormat]);

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

  const handleClose = () => {
    // Reset form
    setTemplateCategory(null);
    setTemplateName('');
    setTemplateType('TEXT');
    setTemplateFormat('');
    setTemplateFooter('');
    setSampleValues([]);
    onClose();
  };

  const createTemplateAPI = useApiCall(
    (templateData: Omit<TemplateOption, 'id'>) => apiService.createTemplate(templateData),
    {
      showErrorToast: true,
      errorMessage: 'Failed to create template',
      onSuccess: () => {
        handleClose();
        onTemplateCreated?.();
      },
    }
  );

  const isLoading = createTemplateAPI.isLoading;

  const updateSampleValue = (placeholder: string, value: string) => {
    setSampleValues((prev) =>
      prev.map((sv) => (sv.placeholder === placeholder ? { ...sv, value } : sv))
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!templateCategory) {
      // Show error toast
      return;
    }
    if (!templateName || !/^[a-z0-9_]+$/.test(templateName)) {
      // Show error toast
      return;
    }
    if (!templateFormat.trim()) {
      // Show error toast
      return;
    }

    // Determine content flags based on template type and format
    const hasText = templateFormat.trim().length > 0;
    const hasImage = templateType === 'IMAGE' || templateFormat.includes('[IMAGE]');
    const hasButton =
      templateType === 'BUTTON' || sampleValues.some((sv) => sv.value.includes('http'));

    const templateData: Omit<TemplateOption, 'id'> = {
      title: templateName,
      message: templateFormat,
      content: {
        text: hasText,
        image: hasImage,
        button: hasButton,
      },
      buttonText: hasButton ? sampleValues.find((sv) => sv.value)?.value : undefined,
      buttonCta: hasButton
        ? sampleValues.find((sv) => sv.value.startsWith('http'))?.value
        : undefined,
    };

    createTemplateAPI.execute(templateData);
  };

  const formatCharCount = templateFormat.length;
  const footerCharCount = templateFooter.length;

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
          <TouchableOpacity onPress={handleClose} style={styles.sidePanelCloseButton}>
            <CloseIcon width={24} height={24} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.sidePanelTitle}>New Template</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.sidePanelScroll}
          contentContainerStyle={styles.sidePanelScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sidePanelContent}>
            {/* Template Category */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Template Category<Text style={styles.fieldRequired}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={0.7}
                onPress={() => setIsCategoryDropdownOpen((prev) => !prev)}
              >
                <Text style={templateCategory ? styles.dropdownValue : styles.dropdownPlaceholder}>
                  {templateCategory || '-Select-'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {isCategoryDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {templateCategories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.dropdownItem,
                        templateCategory === category && styles.dropdownItemSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setTemplateCategory(category);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          templateCategory === category && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Template Name */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>
                  Template Name<Text style={styles.fieldRequired}>*</Text>
                </Text>
              </View>
              <TextInput
                style={styles.fieldInput}
                placeholder="-Select-"
                placeholderTextColor="#98A2B3"
                value={templateName}
                onChangeText={setTemplateName}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.fieldHelperText}>
                Name can only be in lowercase alphanumeric characters and underscores. Special
                characters and white-space are not allowed
              </Text>
            </View>

            {/* Template Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Template Type<Text style={styles.fieldRequired}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={0.7}
                onPress={() => setIsTypeDropdownOpen((prev) => !prev)}
              >
                <Text style={styles.dropdownValue}>{templateType}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {isTypeDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {templateTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        templateType === type && styles.dropdownItemSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setTemplateType(type);
                        setIsTypeDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          templateType === type && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Template Format */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>
                  Template Format<Text style={styles.fieldRequired}>*</Text>
                </Text>
                <Text style={styles.fieldCharCount}>{formatCharCount}/1024</Text>
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Enter template message..."
                placeholderTextColor="#98A2B3"
                value={templateFormat}
                onChangeText={setTemplateFormat}
                multiline
                maxLength={1024}
                textAlignVertical="top"
              />
              <Text style={styles.fieldHelperText}>
                Use text formatting - *bold* , _italic_ & ~strikethrough~
                {'\n'}Your message content. Upto 1024 characters are allowed.
                {'\n'}e.g. - Hello [[1]], your code will expire in [[2]] mins.
              </Text>
            </View>

            {/* Sample Values */}
            {sampleValues.length > 0 && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Sample Values<Text style={styles.fieldRequired}>*</Text>
                </Text>
                {sampleValues.map((sampleValue) => (
                  <View key={sampleValue.placeholder} style={styles.sampleValueRow}>
                    <View style={styles.sampleValuePlaceholder}>
                      <Text style={styles.sampleValuePlaceholderText}>
                        {`[[${sampleValue.placeholder}]]`}
                      </Text>
                    </View>
                    <TextInput
                      style={styles.sampleValueInput}
                      placeholder="Enter value"
                      placeholderTextColor="#98A2B3"
                      value={sampleValue.value}
                      onChangeText={(value) => updateSampleValue(sampleValue.placeholder, value)}
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Template Footer */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Template Footer</Text>
                <Text style={styles.fieldCharCount}>{footerCharCount}/60</Text>
              </View>
              <TextInput
                style={styles.footerTextArea}
                placeholder="Enter here"
                placeholderTextColor="#98A2B3"
                value={templateFooter}
                onChangeText={setTemplateFooter}
                multiline
                maxLength={60}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerCancelButton} onPress={handleClose}>
            <Text style={styles.footerCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerPrimaryButton, isLoading && styles.footerPrimaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.footerPrimaryText}>Schedule</Text>
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
    fontWeight: '700',
    color: '#101828',
    fontFamily: 'Manrope',
  },
  sidePanelCloseButton: {
    padding: 4,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidePanelScroll: {
    flex: 1,
  },
  sidePanelScrollContent: {
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  sidePanelContent: {
    gap: 24,
    padding: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
  },
  fieldGroup: {
    width: '100%',
    gap: 12,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  fieldRequired: {
    color: '#FF0004',
  },
  fieldCharCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#98A2B3',
    fontFamily: 'Albert Sans',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0C111D',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Albert Sans',
    height: 44,
  },
  fieldHelperText: {
    fontSize: 13,
    color: '#98A2B3',
    fontFamily: 'Albert Sans',
    lineHeight: 18,
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
    shadowColor: '#19213D',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#98A2B3',
    fontFamily: 'Albert Sans',
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
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
    shadowColor: '#19213D',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
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
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#104502',
    fontFamily: 'Albert Sans',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0C111D',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Albert Sans',
    height: 199,
    textAlignVertical: 'top',
    shadowColor: '#19213D',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  sampleValueRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  sampleValuePlaceholder: {
    width: 39,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    shadowColor: '#19213D',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  sampleValuePlaceholderText: {
    fontSize: 14,
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  sampleValueInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0C111D',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Albert Sans',
    height: 44,
    shadowColor: '#19213D',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  footerTextArea: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#98A2B3',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Albert Sans',
    height: 90,
    textAlignVertical: 'top',
    shadowColor: '#19213D',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  footer: {
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
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  footerPrimaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#155A03',
    minWidth: 168,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPrimaryButtonDisabled: {
    opacity: 0.5,
  },
  footerPrimaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default CreateTemplateSidePanel;
