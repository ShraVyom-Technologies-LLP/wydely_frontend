import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import FormTextInput from "./FormTextInput";
import PhoneInput from "./PhoneInput";
import colors from "../theme/colors";
import { FormValues } from "../hooks/useSignUpForm";

interface SignUpFormProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  control,
  errors,
  onSubmit,
  isSubmitting,
}) => {
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

      {/* Company Website */}
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
        render={({ field: { value, onChange, onBlur } }) => (
          <FormTextInput
            label="Password"
            placeholder="Create your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      {/* Create Account Button */}
      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && { opacity: 0.95 },
        ]}
      >
        <Text style={styles.primaryBtnText}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  formFields: {
    width: "100%",
    gap: 28,
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    width: 249,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 25,
  },
});

export default SignUpForm;
