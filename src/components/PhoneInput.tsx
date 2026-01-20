import { View, Text, TextInput, StyleSheet } from "react-native";
import type { TextInputProps } from "react-native";
import colors from "../theme/colors";

type Props = {
  label: string;
  value?: string;
  onChangeText?: (t: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  countryCode?: string; // default +91
};

export default function PhoneInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder = "9999999999",
  error,
  countryCode = "+91",
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, error && styles.rowError]}>
        <Text style={styles.codeText}>{countryCode}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 0 }, // Remove bottom margin, handled by parent gap
  label: {
    color: colors.textMuted, // Use Grey/400 from Figma
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    borderRadius: 6,
    height: 48,
    paddingHorizontal: 16, // Match Figma padding
  },
  rowError: { borderColor: colors.error },
  codeText: {
    color: colors.text,
    fontWeight: "600", // SemiBold for country code
    fontSize: 16,
    marginRight: 16, // Match Figma spacing
  },
  input: {
    flex: 1,
    color: colors.text, // Use placeholder color for empty state
    fontSize: 16,
    fontWeight: "500", // Medium weight for phone number
  },
  error: { marginTop: 6, color: colors.error, fontSize: 12 },
});
