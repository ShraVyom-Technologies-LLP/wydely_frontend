import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Control, FieldErrors } from 'react-hook-form';
import FormTextInput from './FormTextInput';
import PhoneInput from './PhoneInput';
import colors from '../theme/colors';
import { FormValues } from '../hooks/useSignUpForm';

interface SignUpFormProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const companySizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

const SignUpForm: React.FC<SignUpFormProps> = ({ control, errors, onSubmit, isSubmitting }) => {
  const [isCompanySizeOpen, setIsCompanySizeOpen] = React.useState(false);

  return (
    <View style={styles.formFields}>
      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormTextInput
            label="Name"
            placeholder="Enter your name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            isActive={!!value}
          />
        )}
      />

      {/* Company Name */}
      <Controller
        control={control}
        name="companyName"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormTextInput
            label="Company Name"
            placeholder="Enter your company name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.companyName?.message}
          />
        )}
      />

      {/* Company Email Address */}
      <Controller
        control={control}
        name="companyEmail"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormTextInput
            label="Company Email Address"
            placeholder="Enter your email address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            error={errors.companyEmail?.message}
          />
        )}
      />

      {/* Company Website + Company Size */}
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Controller
            control={control}
            name="companyWebsite"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormTextInput
                label="Company Website"
                placeholder="https://www.example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="url"
                error={errors.companyWebsite?.message}
              />
            )}
          />
        </View>

        <View style={styles.rowItem}>
          <Controller
            control={control}
            name="companySize"
            render={({ field: { value, onChange } }) => (
              <View style={styles.dropdownWrapper}>
                <Text style={styles.dropdownLabel}>Company Size</Text>
                <Pressable
                  style={styles.dropdownInput}
                  onPress={() => setIsCompanySizeOpen((open) => !open)}
                >
                  <Text style={value ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
                    {value || 'Select Company size'}
                  </Text>
                  <Text style={styles.dropdownChevron}>⌄</Text>
                </Pressable>
                {isCompanySizeOpen && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled>
                      {companySizeOptions.map((option) => (
                        <Pressable
                          key={option}
                          style={styles.dropdownOption}
                          onPress={() => {
                            onChange(option);
                            setIsCompanySizeOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{option}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {!!errors.companySize?.message && (
                  <Text style={styles.dropdownError}>{errors.companySize.message}</Text>
                )}
              </View>
            )}
          />
        </View>
      </View>

      {/* WhatsApp Number (+91 prefix) */}
      <Controller
        control={control}
        name="phone"
        render={({ field: { value, onChange, onBlur } }) => (
          <PhoneInput
            label="Personal WhatsApp Number"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
            countryCode="+91"
            placeholder="9999999999"
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => {
          const password = value || '';
          const hasMinLength = password.length >= 8;
          const hasNumber = /\d/.test(password);
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
          const showHelper = password.length > 0;

          const renderRule = (label: string, met: boolean) => (
            <View key={label} style={styles.passwordRuleRow}>
              <Text
                style={[styles.passwordRuleIcon, { color: met ? colors.checkmark : colors.error }]}
              >
                {met ? '✓' : '✕'}
              </Text>
              <Text
                style={[
                  styles.passwordRuleText,
                  met ? styles.passwordRuleTextSuccess : styles.passwordRuleTextError,
                ]}
              >
                {label}
              </Text>
            </View>
          );

          return (
            <View>
              <FormTextInput
                label="Password"
                placeholder="Create your password"
                value={password}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.password?.message}
                isActive={!!password}
              />
              {showHelper && (
                <View style={styles.passwordHelperContainer}>
                  {renderRule('Must be atleast 8 characters', hasMinLength)}
                  {renderRule('Must contain atleast 1 number', hasNumber)}
                  {renderRule('Must be atleast 1 in Capital Case', hasUppercase)}
                  {renderRule('Must be atleast 1 letter in Small Case', hasLowercase)}
                  {renderRule('Must contain atleast 1 Special Character', hasSpecialChar)}
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Create Account Button */}
      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.95 }]}
      >
        <Text style={styles.primaryBtnText}>{isSubmitting ? 'Creating...' : 'Create Account'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  formFields: {
    width: '100%',
    gap: 28,
  },
  row: {
    flexDirection: 'row',
    gap: 28,
    position: 'relative',
    zIndex: 10,
  },
  rowItem: {
    flex: 1,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 100,
  },
  dropdownLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
    fontWeight: '500',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 48,
  },
  dropdownValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  dropdownPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  dropdownChevron: {
    fontSize: 16,
    color: colors.textLight,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    zIndex: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.inputBg,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dropdownError: {
    marginTop: 6,
    color: colors.error,
    fontSize: 12,
  },
  passwordHelperContainer: {
    marginTop: 8,
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#F5F7F9',
    gap: 6,
  },
  passwordRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordRuleIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  passwordRuleText: {
    fontSize: 14,
  },
  passwordRuleTextError: {
    color: colors.error,
  },
  passwordRuleTextSuccess: {
    color: colors.checkmark,
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 25,
  },
});

export default SignUpForm;
