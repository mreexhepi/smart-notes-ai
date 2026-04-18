import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../constants/colors";

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GlassCard({ children, style }: GlassCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type SectionHeaderProps = {
  title: string;
  meta?: string;
};

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null}
    </View>
  );
}

type AppInputProps = TextInputProps & {
  error?: string | null;
};

export function AppInput({ error, multiline, style, ...props }: AppInputProps) {
  return (
    <View style={styles.inputWrap}>
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          multiline ? styles.inputMultiline : undefined,
          error ? styles.inputError : undefined,
          style,
        ]}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        {...props}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: PrimaryButtonProps) {
  const isDisabled = !!disabled || !!loading;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.primaryButton,
        isDisabled ? styles.primaryButtonDisabled : undefined,
      ]}
    >
      {loading ? (
        <View style={styles.buttonContent}>
          <ActivityIndicator size="small" color={colors.white} />
          <Text style={styles.primaryButtonText}>Please wait...</Text>
        </View>
      ) : (
        <Text style={styles.primaryButtonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

type InlineTextButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function InlineTextButton({
  label,
  onPress,
  disabled,
}: InlineTextButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={styles.inlineButton}
    >
      <Text
        style={[
          styles.inlineButtonText,
          disabled ? styles.inlineDisabled : undefined,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type EmptyStateProps = {
  title: string;
  subtitle: string;
};

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>✦</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  inputWrap: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8fafc",
    color: colors.text,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
  },
  inputMultiline: {
    minHeight: 120,
  },
  inputError: {
    borderColor: colors.danger,
  },
  fieldError: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    paddingHorizontal: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inlineButton: {
    marginTop: 14,
    alignSelf: "center",
  },
  inlineButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  inlineDisabled: {
    opacity: 0.5,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 42,
    paddingHorizontal: 18,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyIconText: {
    color: colors.primaryText,
    fontSize: 26,
    fontWeight: "800",
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
});