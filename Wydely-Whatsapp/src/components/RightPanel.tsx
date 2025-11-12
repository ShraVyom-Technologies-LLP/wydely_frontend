import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import FormHeader from "./FormHeader";
import { Control, FieldErrors } from "react-hook-form";

interface RightPanelProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  onSubmit: () => void;
  isSubmitting: boolean;
  title: string;
  subtitle: string;
  loginLinkText: string;
  onLoginPress?: () => void;
  formComponent: React.ReactNode;
}

const RightPanel: React.FC<RightPanelProps> = ({
  control,
  errors,
  onSubmit,
  isSubmitting,
  title,
  subtitle,
  loginLinkText,
  onLoginPress,
  formComponent,
}) => {
  return (
    <View style={styles.right}>
      <ScrollView
        contentContainerStyle={styles.rightScroll}
        keyboardShouldPersistTaps="handled"
      >
        <FormHeader
          title={title}
          subtitle={subtitle}
          loginLinkText={loginLinkText}
          onLoginPress={onLoginPress}
        />

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>{formComponent}</View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  right: { flex: 1, padding: 24 },
  rightScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 630,
    gap: 40,
  },
  textContainer: {
    width: "100%",
    gap: 32,
  },
});

export default RightPanel;
