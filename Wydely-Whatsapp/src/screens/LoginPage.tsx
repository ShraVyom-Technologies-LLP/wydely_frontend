import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';
import { useLoginForm } from '../hooks/useLoginForm';
import LoginLeftPanel from '../components/LoginLeftPanel';
import RightPanel from '../components/RightPanel';
import LoginForm from '../components/LoginForm';
import { RootStackParamList } from '../navigation/types';
import { apiService } from '../services/api';
import { useApiCall } from '../hooks/useApiCall';
import LoadingWidget from '../components/LoadingWidget';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const {
    control,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useLoginForm();

  // Unified login API hook - supports both OTP and password
  const loginApi = useApiCall(
    (emailOrMobile: string, loginType: 'otp' | 'password', otp?: string, password?: string) =>
      apiService.login(emailOrMobile, loginType, otp, password),
    {
      showErrorToast: true,
      errorMessage: 'Login failed',
    }
  );

  const handleSignUpPress = () => {
    // Force page reload to ensure fresh SVG rendering
    if (typeof window !== 'undefined') {
      window.location.href = '/signup';
    } else {
      navigation.navigate('SignUp');
    }
  };

  const handleLoginSubmit = async () => {
    const emailValue = getValues('email')?.trim() || '';
    const password = getValues('password')?.trim() || '';

    clearErrors('email');
    clearErrors('password');

    // Validate email is present
    if (!emailValue) {
      setError('email', {
        type: 'manual',
        message: 'Please enter your email address',
      });
      return;
    }

    // Validate password is present
    if (!password || password.length < 6) {
      setError('password', {
        type: 'manual',
        message: 'Please enter a valid password',
      });
      return;
    }

    // Use unified login endpoint with password
    const result = await loginApi.execute(emailValue, 'password', undefined, password);

    // Check if result is LoginResponse (has user property) to navigate
    if (result && typeof result === 'object' && 'user' in result) {
      navigation.navigate('Projects');
    }
    // Error is already shown via toast, no need to set form error
  };

  const handleLoginViaOTPButtonPress = async () => {
    const emailValue = getValues('email')?.trim() || '';

    clearErrors('email');

    // Validate email is present
    if (!emailValue) {
      setError('email', {
        type: 'manual',
        message: 'Please enter your email address',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setError('email', {
        type: 'manual',
        message: 'Enter a valid email',
      });
      return;
    }

    // Use unified login endpoint to send OTP
    const result = await loginApi.execute(emailValue, 'otp');

    // Check if result is SendOtpResponse (has email/mobileNo but no user property)
    if (result && typeof result === 'object' && 'email' in result && !('user' in result)) {
      // Navigate to OTP verification page
      if (typeof window !== 'undefined') {
        window.location.href = `/otp?email=${encodeURIComponent(emailValue)}&from=login`;
      } else {
        navigation.navigate('OTP', { email: emailValue, phoneNumber: '', from: 'login' });
      }
    }
    // Error is already shown via toast, no need to set form error
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
            subheadline="Use your account to start engaging customers on WhatsApp instantly."
          />
        )}

        {/* Right Panel - Form Section */}
        <RightPanel
          title="Welcome back!"
          subtitle="Don't have an account?"
          loginLinkText="Register"
          onLoginPress={handleSignUpPress}
          formComponent={
            <>
              {loginApi.isLoading && <LoadingWidget />}
              <LoginForm
                control={control}
                errors={errors}
                onSubmit={handleLoginSubmit}
                isSubmitting={loginApi.isLoading}
                onLoginViaOTPButtonPress={handleLoginViaOTPButtonPress}
              />
            </>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: 'row' },
});
