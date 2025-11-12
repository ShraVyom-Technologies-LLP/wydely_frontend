import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import type { TextInputProps } from "react-native";
import colors from "../theme/colors";

type Props = {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
};

export default function OTPInput({
  length = 6,
  value,
  onChangeText,
  error,
}: Props) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, "");

    if (digit.length > 1) {
      // Handle paste - take first digit
      const newValue = value.split("");
      newValue[index] = digit[0];
      const updatedValue = newValue.join("").slice(0, length);
      onChangeText(updatedValue);

      // Focus next empty input
      if (index < length - 1 && updatedValue.length < length) {
        const nextIndex = index + 1;
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const newValue = value.split("");
    if (digit) {
      newValue[index] = digit;
      onChangeText(newValue.join("").slice(0, length));

      // Auto-focus next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Handle backspace - clear current and move to previous
      newValue[index] = "";
      onChangeText(newValue.join(""));
      if (index > 0 && !value[index]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace on empty input
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>OTP</Text>
      <View style={styles.inputContainer}>
        {Array.from({ length }).map((_, index) => {
          const inputStyles: any[] = [
            styles.input,
            focusedIndex === index ? styles.inputFocused : null,
            error ? styles.inputError : null,
          ].filter(Boolean);

          // Add web-specific styles if needed
          if (Platform.OS === "web") {
            const webStyles = inputStyles[inputStyles.length - 1] || {};
            inputStyles[inputStyles.length - 1] = {
              ...webStyles,
              outline: "none",
              boxShadow: "none",
            };
          }

          return (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={inputStyles}
              value={value[index] || ""}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              placeholder="0"
              placeholderTextColor={colors.textLight}
            />
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textLight,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    width: "95%",
  },
  input: {
    flex: 1,
    height: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    backgroundColor: colors.inputBg,
    minWidth: 0, // Allow flex to shrink below content size
  },
  inputFocused: {
    borderColor: colors.borderActive,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: 8,
    fontSize: 14,
    color: colors.error,
  },
});
