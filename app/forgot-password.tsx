import { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import { colors } from "../src/constants/colors";
import {
  AppInput,
  GlassCard,
  InlineTextButton,
  PrimaryButton,
  SectionHeader,
} from "../src/components/ui";
import {
  mapAuthErrorMessage,
  validateEmail,
} from "../src/utils/auth";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    const emailCheck = validateEmail(email);
    setEmailError(emailCheck.message);

    if (!emailCheck.valid) {
      return;
    }

    setLoading(true);

    try {
      const redirectTo = Linking.createURL("/reset-password");

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        throw error;
      }

      setSent(true);
    } catch (error: any) {
      Alert.alert("Reset failed", mapAuthErrorMessage(error?.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>ACCOUNT RECOVERY</Text>
          <Text style={styles.heroTitle}>Forgot your password?</Text>
          <Text style={styles.heroSubtitle}>
            Enter your email and we’ll send you a secure reset link.
          </Text>
        </View>

        <GlassCard>
          <SectionHeader title="Reset password" meta="EMAIL FLOW" />

          {sent ? (
            <>
              <View style={styles.successBanner}>
                <Text style={styles.successText}>
                  Reset email sent successfully. Check your inbox and open the
                  link on this device.
                </Text>
              </View>

              <InlineTextButton
                label="Back to login"
                onPress={() => router.replace("/")}
              />
            </>
          ) : (
            <>
              <AppInput
                placeholder="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (emailError) setEmailError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                error={emailError}
              />

              <PrimaryButton
                label="Send reset link"
                loading={loading}
                disabled={!email.trim()}
                onPress={handleSendReset}
              />

              <InlineTextButton
                label="Back to login"
                onPress={() => router.replace("/")}
                disabled={loading}
              />
            </>
          )}
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 18,
    justifyContent: "center",
  },
  hero: {
    backgroundColor: colors.hero,
    borderRadius: 30,
    padding: 22,
    marginBottom: 18,
  },
  heroEyebrow: {
    color: "#93c5fd",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  heroSubtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 24,
  },
  successBanner: {
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
});