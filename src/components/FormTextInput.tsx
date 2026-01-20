import { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable } from "react-native";
import type { TextInputProps } from "react-native";
import colors from "../theme/colors";
import EyeOffIcon from "./icons/EyeOffIcon";
import EyeIcon from "../../assets/icons/eye.svg";

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
  error?: string;
  isActive?: boolean; // For styling active/filled fields
};

export default function FormTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  keyboardType = "default",
  error,
  isActive = false,
}: Props) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          error ? styles.inputWrapError : undefined,
          isActive ? styles.inputWrapActive : undefined,
        ]}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={styles.input}
          // Web-specific props to remove focus styling
          {...(typeof window !== "undefined" && {
            style: [styles.input, { outline: "none", boxShadow: "none" }],
          })}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            style={styles.iconButton}
          >
            {hidden ? (
              <EyeOffIcon width={20} height={20} color={colors.textMuted} />
            ) : (
              <EyeIcon width={20} height={20} color={colors.textMuted} />
            )}
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 0 }, // Remove bottom margin, handled by parent gap
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 48,
    // Web-specific styles to remove focus outline
    ...(typeof window !== "undefined" && {
      outline: "none",
      boxShadow: "none",
    }),
  },
  inputWrapError: { borderColor: colors.error },
  inputWrapActive: { borderColor: colors.borderActive },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
    borderWidth: 0, // Remove blue focus ring on web
  },
  iconButton: { paddingLeft: 8 },
  error: { marginTop: 6, color: colors.error, fontSize: 12 },
});
