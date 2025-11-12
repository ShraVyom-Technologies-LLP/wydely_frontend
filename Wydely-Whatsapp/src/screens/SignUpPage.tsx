import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import colors from "../theme/colors";
import { useSignUpForm, FormValues } from "../hooks/useSignUpForm";
import SignUpLeftPanel from "../components/SignUpLeftPanel";
import RightPanel from "../components/RightPanel";
import SignUpForm from "../components/SignUpForm";
import { RootStackParamList } from "../navigation/types";
import { apiService } from "../services/api";

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

export default function SignUpPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100; // two-column breakpoint
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const {
    control,
    handleSubmit: formHandleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useSignUpForm();

  const handleLoginPress = () => {
    // Force page reload to ensure fresh SVG rendering
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSignUpSubmit = formHandleSubmit(async (values: FormValues) => {
    console.log("SignUp payload:", values);

    const result = await apiService.signUp(values);

    if (result.success) {
      console.log("Signup successful:", result.data);
      // Navigate to OTP screen with email
      const email = values.companyEmail;
      if (typeof window !== "undefined") {
        window.location.href = `/otp?email=${encodeURIComponent(
          email
        )}&from=signup`;
      } else {
        navigation.navigate("OTP", { email, from: "signup" });
      }
    } else {
      console.error("Signup failed:", result.error);
      // Handle error - you could set a form error here
      if (result.error) {
        setError("root", {
          type: "manual",
          message: result.error,
        });
      }
    }
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.wrapper}>
        {/* Left Panel - Hero Section */}
        {isWide && (
          <SignUpLeftPanel
            headline="Power Your WhatsApp Marketing in Minutes"
            subheadline="Create your free account and start engaging customers on WhatsApp instantly."
            showHero={true}
            showPills={true}
          />
        )}

        {/* Right Panel - Form Section */}
        <RightPanel
          control={control}
          errors={errors}
          onSubmit={handleSignUpSubmit}
          isSubmitting={isSubmitting}
          title="Create your account with us below"
          subtitle="Already have an account?"
          loginLinkText="Login"
          onLoginPress={handleLoginPress}
          formComponent={
            <SignUpForm
              control={control}
              errors={errors}
              onSubmit={handleSignUpSubmit}
              isSubmitting={isSubmitting}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: "row" },
});
