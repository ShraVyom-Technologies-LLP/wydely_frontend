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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const {
    control,
    formState: { errors, isSubmitting },
    onSubmit,
    getValues,
    setError,
    clearErrors,
  } = useLoginForm();

  const handleSignUpPress = () => {
    // Force page reload to ensure fresh SVG rendering
    if (typeof window !== 'undefined') {
      window.location.href = '/signup';
    } else {
      navigation.navigate('SignUp');
    }
  };

  const handleLoginSuccess = () => {
    // Navigate to dashboard after successful login
    navigation.navigate('Dashboard');
  };

  const handleLoginViaOTP = () => {
    // Get email from form
    const emailValue = getValues('email')?.trim() || '';

    // Clear any previous errors
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

    // If email is valid, navigate to OTP verification page
    if (typeof window !== 'undefined') {
      window.location.href = `/otp?email=${encodeURIComponent(emailValue)}&from=login`;
    } else {
      navigation.navigate('OTP', { email: emailValue, from: 'login' });
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
            <LoginForm
              control={control}
              errors={errors}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              onLoginViaOTP={handleLoginViaOTP}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: 'row' },
});
