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
import { clearFormData } from '../utils/formStorage';
import { useApiCall } from '../hooks/useApiCall';
import LoadingWidget from '../components/LoadingWidget';
import { useAuth } from '../context/AuthContext';

type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

type FormValues = {
  otp: string;
  emailOtp: string;
  phoneOtp: string;
};

type Props = {
  handleBack?: () => void;
};

export default function OTPVerificationPage({ handleBack }: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const { setAuthData } = useAuth();

  // Get email and from params, also check URL params for web
  let email = route.params?.email || 'your email';
  let from = route.params?.from;
  const phoneNumber = route.params?.phoneNumber || 'your WhatsApp number';
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
  const [isPhoneResending, setIsPhoneResending] = useState(false);
  const [isEmailResending, setIsEmailResending] = useState(false);
  const [phoneResendCooldown, setPhoneResendCooldown] = useState(0);
  const [emailResendCooldown, setEmailResendCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      otp: '',
      emailOtp: '',
      phoneOtp: '',
    },
    mode: 'onBlur',
  });

  // API call hooks - bind methods to preserve 'this' context
  // For signup, use verifyOtp endpoint; for login, use unified login endpoint
  const verifyOtpApi = useApiCall(
    (data: Parameters<typeof apiService.verifyOtp>[0]) => apiService.verifyOtp(data),
    {
      showErrorToast: true,
      errorMessage: 'OTP verification failed',
      onSuccess: async (responseData) => {
        // Save auth data to storage
        if (responseData) {
          await setAuthData({
            accessToken: responseData.accessToken,
            refreshToken: responseData.refreshToken,
            sessionId: responseData.sessionId,
            wydelyBusinessId: responseData.wydelyBusinessId,
            accessTokenExpiresAt: responseData.accessTokenExpiresAt,
            email: responseData.email,
          });
          if (from === 'signup') {
            await clearFormData();
          }
          navigation.navigate('Projects');
        }
      },
    }
  );

  // Unified login API for OTP verification (login flow only)
  const verifyLoginOtpApi = useApiCall(
    (emailOrMobile: string, otp: string) => apiService.verifyLoginOtp(emailOrMobile, otp),
    {
      showErrorToast: true,
      errorMessage: 'OTP verification failed',
      onSuccess: async (responseData) => {
        // Save auth data to storage
        if (responseData) {
          await setAuthData({
            accessToken: responseData.accessToken,
            refreshToken: responseData.refreshToken,
            sessionId: responseData.sessionId,
            wydelyBusinessId: responseData.wydelyBusinessId,
            accessTokenExpiresAt: responseData.accessTokenExpiresAt,
            email: responseData.email,
          });
          navigation.navigate('Projects');
        }
      },
    }
  );

  // Unified login API for resending OTP (login flow only)
  const resendLoginOtpApi = useApiCall(
    (emailOrMobile: string) => apiService.login(emailOrMobile, 'otp'),
    {
      showErrorToast: true,
      errorMessage: 'Failed to resend OTP',
    }
  );

  // Resend OTP API for signup flow
  const resendOtpApi = useApiCall((email: string) => apiService.resendOtp(email), {
    showErrorToast: true,
    errorMessage: 'Failed to resend OTP',
  });

  const otpValue = watch('otp');
  const emailOtpValue = watch('emailOtp');
  const phoneOtpValue = watch('phoneOtp');
  const isFromSignup = from === 'signup';

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

  const handleEmailResend = async () => {
    if (isEmailResending || emailResendCooldown > 0) return;

    setIsEmailResending(true);

    // Use unified login endpoint for login flow, resendOtp for signup flow
    const result =
      from === 'login' ? await resendLoginOtpApi.execute(email) : await resendOtpApi.execute(email);

    if (result) {
      setEmailResendCooldown(60);
      const interval = setInterval(() => {
        setEmailResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    setIsEmailResending(false);
  };

  const onSubmit = async (_values: FormValues) => {
    if (from === 'login') {
      // Use verifyLoginOtp endpoint for login OTP verification
      await verifyLoginOtpApi.execute(email, _values.otp);
    } else {
      // Use verifyOtp endpoint for signup OTP verification
      await verifyOtpApi.execute({
        email: email,
        emailOtp: _values.otp,
      });
    }
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
              <Text style={styles.title}>
                {isFromSignup ? 'Verify Email and Mobile Number' : 'OTP Verification'}
              </Text>
            </View>

            {/* Signup OTP section - commented out for now, using same flow for login and signup */}
            {/* {isFromSignup ? (
              <View style={styles.signupContentContainer}>
                <View style={styles.otpSection}>
                  <View style={styles.otpSectionHeader}>
                    <Text style={styles.otpSectionText}>
                      <Text style={styles.otpSectionLabel}>Enter OTP sent to </Text>
                      <Text style={styles.otpSectionHighlight}>{email}</Text>
                    </Text>

                    {emailResendCooldown > 0 ? (
                      <Text style={styles.resendText}>
                        <Text style={styles.resendTextGrey}>Resend OTP in </Text>
                        <Text style={styles.resendCountdown}>
                          00:{String(emailResendCooldown).padStart(2, '0')}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.resendText}>
                        <Text style={styles.resendLink} onPress={handleEmailResend}>
                          RESEND
                        </Text>
                      </Text>
                    )}
                  </View>
                  <Controller
                    control={control}
                    name="emailOtp"
                    render={({ field: { onChange, value } }) => (
                      <OTPInput
                        value={value}
                        hideLabel
                        onChangeText={(newValue) => {
                          onChange(newValue);
                          setValue('emailOtp', newValue, { shouldValidate: true });
                        }}
                        error={errors.emailOtp?.message}
                      />
                    )}
                  />
                </View>

                <View style={styles.otpSection}>
                  <View style={styles.otpSectionHeader}>
                    <Text style={styles.otpSectionText}>
                      <Text style={styles.otpSectionLabel}>Enter OTP sent to </Text>
                      <Text style={styles.otpSectionHighlight}>{phoneNumber}</Text>
                    </Text>
                    {phoneResendCooldown > 0 ? (
                      <Text style={styles.resendText}>
                        <Text style={styles.resendTextGrey}>Resend OTP in </Text>
                        <Text style={styles.resendCountdown}>
                          00:{String(phoneResendCooldown).padStart(2, '0')}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.resendText}>
                        <Text style={styles.resendLink} onPress={handlePhoneResend}>
                          RESEND
                        </Text>
                      </Text>
                    )}
                  </View>
                  <Controller
                    control={control}
                    name="phoneOtp"
                    render={({ field: { onChange, value } }) => (
                      <OTPInput
                        value={value}
                        hideLabel
                        onChangeText={(newValue) => {
                          onChange(newValue);
                          setValue('phoneOtp', newValue, { shouldValidate: true });
                        }}
                        error={errors.phoneOtp?.message}
                      />
                    )}
                  />
                </View>

                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={
                    isSubmitting || emailOtpValue.length !== 6 || phoneOtpValue.length !== 6
                  }
                  style={({ pressed }) => [
                    styles.submitButton,
                    (isSubmitting || emailOtpValue.length !== 6 || phoneOtpValue.length !== 6) &&
                      styles.submitButtonDisabled,
                    pressed && { opacity: 0.95 },
                  ]}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Verifying...' : 'Submit'}
                  </Text>
                </Pressable>
              </View>
            ) : ( */}
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
                {(verifyOtpApi.isLoading ||
                  verifyLoginOtpApi.isLoading ||
                  resendOtpApi.isLoading ||
                  resendLoginOtpApi.isLoading) && <LoadingWidget />}
                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={
                    verifyOtpApi.isLoading || verifyLoginOtpApi.isLoading || otpValue.length !== 6
                  }
                  style={({ pressed }) => [
                    styles.submitButton,
                    (verifyOtpApi.isLoading ||
                      verifyLoginOtpApi.isLoading ||
                      otpValue.length !== 6) &&
                      styles.submitButtonDisabled,
                    pressed && { opacity: 0.95 },
                  ]}
                >
                  <Text style={styles.submitButtonText}>
                    {verifyOtpApi.isLoading || verifyLoginOtpApi.isLoading
                      ? 'Verifying...'
                      : 'Submit'}
                  </Text>
                </Pressable>

                {/* Resend Link */}
                <View style={styles.resendContainer}>
                  {emailResendCooldown > 0 ? (
                    <Text style={styles.resendText}>
                      <Text style={styles.resendTextActive}>Didn't receive code? </Text>
                      <Text style={styles.resendTextGrey}>Resend OTP in </Text>
                      <Text style={styles.resendCountdown}>
                        00:{String(emailResendCooldown).padStart(2, '0')}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.resendText}>
                      <Text style={styles.resendTextGrey}>Didn't receive code? </Text>
                      <Text style={styles.resendLink} onPress={handleEmailResend}>
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
  signupContentContainer: {
    width: '100%',
    maxWidth: 630,
    gap: 32,
  },
  otpSection: {
    gap: 16,
  },
  otpSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpSectionText: {
    fontSize: 16,
    lineHeight: 25,
  },
  otpSectionLabel: {
    color: colors.textSecondary,
  },
  otpSectionHighlight: {
    color: colors.text,
    fontWeight: '600',
  },
  resendLinkInline: {
    color: colors.link,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: colors.textLight,
    fontWeight: '600',
  },
});
