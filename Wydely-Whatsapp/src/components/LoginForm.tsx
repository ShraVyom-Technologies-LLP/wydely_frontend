import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import FormTextInput from "./FormTextInput";
import colors from "../theme/colors";
import { LoginFormValues } from "../hooks/useLoginForm";

interface LoginFormProps {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
  onLoginViaOTPButtonPress?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  control,
  errors,
  onSubmit,
  isSubmitting,
  onLoginViaOTPButtonPress,
}) => {
  return (
    <View style={styles.formFields}>
      <View style={styles.inputsContainer}>
        {/* Company Email Address */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormTextInput
              label="Company Email Address"
              placeholder="Enter your company email address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              error={errors.email?.message}
              isActive={!!value}
            />
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormTextInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
      </View>

      {/* Login Button */}
      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && { opacity: 0.95 },
        ]}
      >
        <Text style={styles.primaryBtnText}>
          {isSubmitting ? "Signing in..." : "Login"}
        </Text>
      </Pressable>

      {/* Login via OTP Link */}
      {onLoginViaOTPButtonPress && (
        <View style={styles.otpLinkContainer}>
          <Text style={styles.otpLink} onPress={onLoginViaOTPButtonPress}>
            Login via OTP
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formFields: {
    width: "100%",
  },
  inputsContainer: {
    width: "100%",
    gap: 28,
  },
  primaryBtn: {
    marginTop: 38,
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 25,
  },
  otpLinkContainer: {
    alignItems: "center",
    marginTop: 0,
  },
  otpLink: {
    color: colors.link,
    fontSize: 16,
    fontWeight: "400",
    textDecorationLine: "underline",
  },
});

export default LoginForm;
