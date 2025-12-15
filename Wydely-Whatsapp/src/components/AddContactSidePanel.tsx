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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AddContactSidePanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState<string | null>(null);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

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

  const tagOptions = ['New Lead', 'Returning Customer', 'High Value'];

  const charCount = name.length;

  const handleClose = () => {
    onClose();
  };

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
            <Text style={styles.sidePanelCloseIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.sidePanelTitle}>Create Contact</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.sidePanelScroll}
          contentContainerStyle={styles.sidePanelScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sidePanelContent}>
            {/* Name */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>
                  Name<Text style={styles.fieldRequired}>*</Text>
                </Text>
                <Text style={styles.fieldCharCount}>{charCount}/100 characters</Text>
              </View>
              <TextInput
                style={styles.fieldInput}
                placeholder="User Name"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
                maxLength={100}
              />
            </View>

            {/* Mobile Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Mobile Number<Text style={styles.fieldRequired}>*</Text>
              </Text>
              <View style={styles.phoneInputRow}>
                <Text style={styles.phonePrefix}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter WhatsApp Number"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Tags + Source */}
            <View style={styles.twoColumnRow}>
              {/* Tags */}
              <View style={styles.column}>
                <Text style={styles.fieldLabel}>Tags</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  activeOpacity={0.7}
                  onPress={() => setIsTagsDropdownOpen((prev) => !prev)}
                >
                  <Text style={tags ? styles.dropdownValue : styles.dropdownPlaceholder}>
                    {tags || 'Select'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                {isTagsDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {tagOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownItem,
                          tags === option && styles.dropdownItemSelected,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => {
                          setTags(option);
                          setIsTagsDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            tags === option && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Source */}
              <View style={styles.column}>
                <Text style={styles.fieldLabel}>Source</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter here"
                  placeholderTextColor={colors.textLight}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerCancelButton} onPress={handleClose}>
            <Text style={styles.footerCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerPrimaryButton}>
            <Text style={styles.footerPrimaryText}>Add Contact</Text>
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
  },
  sidePanelScrollContent: {
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  sidePanelContent: {
    gap: 24,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
  },
  fieldGroup: {
    width: '100%',
    gap: 8,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fieldRequired: {
    color: colors.error,
  },
  fieldCharCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  phonePrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 24,
  },
  column: {
    flex: 1,
    gap: 8,
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
  },
  dropdownValue: {
    fontSize: 14,
    color: colors.text,
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
    color: '#344054',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#104502',
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
});

export default AddContactSidePanel;
