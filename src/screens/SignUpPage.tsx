import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect } from 'react';
import colors from '../theme/colors';
import { useSignUpForm, FormValues } from '../hooks/useSignUpForm';
import LoginLeftPanel from '../components/LoginLeftPanel';
import RightPanel from '../components/RightPanel';
import SignUpForm from '../components/SignUpForm';
import { RootStackParamList } from '../navigation/types';
import { apiService } from '../services/api';
import { saveFormData, getFormData } from '../utils/formStorage';
import { useApiCall } from '../hooks/useApiCall';
import LoadingWidget from '../components/LoadingWidget';
import { useAuth } from '../context/AuthContext';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100; // two-column breakpoint
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { clearAuthDataFromStorage } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useSignUpForm();

  // API call hook for signup - bind method to preserve 'this' context
  const signUpApi = useApiCall(
    (userData: Parameters<typeof apiService.signUp>[0]) => apiService.signUp(userData),
    {
      showErrorToast: true,
      errorMessage: 'Failed to create account',
    }
  );

  // Restore form data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const restoreFormData = async () => {
        const savedData = await getFormData();
        if (savedData) {
          // Restore form values from storage
          reset(savedData);
        }
      };
      restoreFormData();
    }, [reset])
  );

  // Clear auth data from storage when the component mounts
  useEffect(() => {
    clearAuthDataFromStorage();
  }, []);

  const handleLoginPress = () => {
    // Force page reload to ensure fresh SVG rendering
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSignUpSubmit = handleSubmit(async (values: FormValues) => {
    // Map form values to API format
    // Convert companySize format (e.g., "1-10 employees" to "1 - 10")
    const businessSizeMap: Record<string, string> = {
      '1-10 employees': '1 - 10',
      '11-50 employees': '11 - 50',
      '51-200 employees': '51 - 200',
      '201-500 employees': '201 - 500',
      '500+ employees': '500+',
    };
    const businessSize = businessSizeMap[values.companySize] || values.companySize;

    // Remove country code from phone if present
    const mobileNo = values.phone.replace(/^\+91/, '').trim();

    const signUpData = {
      name: values.name,
      bizName: values.companyName,
      email: values.companyEmail,
      websiteUrl: values.companyWebsite,
      mobileNo: mobileNo,
      password: values.password,
      businessSize: businessSize,
    };

    // Save form data before navigating
    await saveFormData(values);

    // Execute API call
    const result = await signUpApi.execute(signUpData);

    // Check result directly instead of relying on state (which updates asynchronously)
    if (result) {
      // Navigate to OTP screen with email
      const email = values.companyEmail;
      const phoneNumber = values.phone;
      if (typeof window !== 'undefined') {
        window.location.href = `/otp?email=${encodeURIComponent(
          email
        )}&phoneNumber=${encodeURIComponent(phoneNumber)}&from=signup`;
      } else {
        navigation.navigate('OTP', { email, phoneNumber, from: 'signup' });
      }
    } else if (signUpApi.isError && signUpApi.error) {
      setError('root', {
        type: 'manual',
        message: signUpApi.error,
      });
    }
  });

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

        {/* Right Panel - Form Section */}
        <RightPanel
          title="Create your account with us below"
          subtitle="Already have an account?"
          loginLinkText="Login"
          onLoginPress={handleLoginPress}
          formComponent={
            <>
              <SignUpForm
                control={control}
                errors={errors}
                onSubmit={handleSignUpSubmit}
                isSubmitting={signUpApi.isLoading}
              />
            </>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: 'row' },
});
