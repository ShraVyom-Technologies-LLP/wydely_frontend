import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Controller, useForm } from 'react-hook-form';
import colors from '../theme/colors';
import LoginLeftPanel from '../components/LoginLeftPanel';
import OTPInput from '../components/OTPInput';
import { RootStackParamList } from '../navigation/types';
import { apiService } from '../services/api';

type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

type FormValues = {
  otp: string;
};

type Props = {
  handleBack?: () => void;
};

export default function OTPVerificationPage({ handleBack }: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();

  // Get email and from params, also check URL params for web
  let email = route.params?.email || 'your email';
  let from = route.params?.from;

  // For web, also check URL query parameters
  if (typeof window !== 'undefined' && !from) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get('email');
    const urlFrom = urlParams.get('from');
    if (urlEmail) email = urlEmail;
    if (urlFrom === 'login' || urlFrom === 'signup') {
      from = urlFrom;
    }
  }
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      otp: '',
    },
    mode: 'onBlur',
  });

  const otpValue = watch('otp');

  const navigateTo = (webPath: string, screen: 'Login' | 'SignUp') => {
    if (typeof window !== 'undefined') {
      window.location.href = webPath;
    } else {
      navigation.navigate(screen);
    }
  };

  const handleBackPress = () => {
    if (handleBack) {
      handleBack();
      return;
    }
    if (from === 'signup') {
      navigateTo('/signup', 'SignUp');
    } else {
      // default + 'login' both go to login
      navigateTo('/login', 'Login');
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;

    setIsResending(true);

    const response = await apiService.resendOtp(email);
    if (response.success) {
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    setIsResending(false);
  };

  const onSubmit = async (_values: FormValues) => {
    // TODO: Implement OTP verification API call and handle errors
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.wrapper}>
        {/* Left Panel - Hero Section */}
        {isWide && (
          <LoginLeftPanel
            headline="Power Your WhatsApp Marketing in Minutes"
            subheadline="Create your free account and start engaging customers on WhatsApp instantly."
          />
        )}

        {/* Right Panel - OTP Form Section */}
        <View style={styles.right}>
          <ScrollView
            contentContainerStyle={styles.rightScroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header with back button */}
            <View style={styles.header}>
              <Pressable onPress={handleBackPress} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </Pressable>
              <Text style={styles.title}>OTP Verification</Text>
            </View>

            {/* Email info */}
            <View style={styles.contentContainer}>
              <Text style={styles.emailText}>
                We sent a code to <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              {/* OTP Input */}
              <View style={styles.formContainer}>
                <Controller
                  control={control}
                  name="otp"
                  render={({ field: { onChange, value } }) => (
                    <OTPInput
                      value={value}
                      onChangeText={(newValue) => {
                        onChange(newValue);
                        setValue('otp', newValue, { shouldValidate: true });
                      }}
                      error={errors.otp?.message}
                    />
                  )}
                />

                {/* Submit Button */}
                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting || otpValue.length !== 6}
                  style={({ pressed }) => [
                    styles.submitButton,
                    (isSubmitting || otpValue.length !== 6) && styles.submitButtonDisabled,
                    pressed && { opacity: 0.95 },
                  ]}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Verifying...' : 'Submit'}
                  </Text>
                </Pressable>

                {/* Resend Link */}
                <View style={styles.resendContainer}>
                  {resendCooldown > 0 ? (
                    <Text style={styles.resendText}>
                      <Text style={styles.resendTextActive}>Didn't receive code? </Text>
                      <Text style={styles.resendTextGrey}>Resend OTP in </Text>
                      <Text style={styles.resendCountdown}>
                        00:{String(resendCooldown).padStart(2, '0')}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.resendText}>
                      <Text style={styles.resendTextGrey}>Didn't receive code? </Text>
                      <Text style={styles.resendLink} onPress={handleResend}>
                        RESEND
                      </Text>
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  right: {
    flex: 1,
    padding: 24,
  },
  rightScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  header: {
    width: '100%',
    maxWidth: 630,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: colors.text,
    fontWeight: '200',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 41,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 630,
    gap: 40,
  },
  emailText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 25,
  },
  emailHighlight: {
    color: colors.link,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    width: '95%',
    marginTop: 32,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    fontSize: 16,
    lineHeight: 25,
  },
  resendTextActive: {
    color: colors.link, // Green
    fontWeight: '600',
  },
  resendTextGrey: {
    color: colors.textSecondary, // Grey
  },
  resendLink: {
    color: colors.link, // Green
    fontWeight: '600',
  },
  resendCountdown: {
    color: '#FF6B00', // Orange
    fontWeight: '600',
  },
});
