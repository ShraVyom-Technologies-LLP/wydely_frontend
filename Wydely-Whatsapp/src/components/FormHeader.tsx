import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  loginLinkText: string;
  onLoginPress?: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  loginLinkText,
  onLoginPress,
}) => {
  return (
    <View style={styles.formHeader}>
      <Text style={styles.formTitle}>{title}</Text>
      <Text style={styles.formSmall}>
        {subtitle}{" "}
        <Text style={styles.loginLink} onPress={onLoginPress}>
          {loginLinkText}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  formHeader: {
    width: "100%",
    maxWidth: 630,
    marginBottom: 44,
    gap: 12,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 41,
  },
  formSmall: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
  },
  loginLink: {
    color: colors.link,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default FormHeader;
