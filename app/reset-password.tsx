import { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
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
  validatePassword,
} from "../src/utils/auth";

function getParamsFromUrl(input?: string | null) {
  if (!input) return new URLSearchParams();

  const normalized = input.replace("#", "?");
  const queryIndex = normalized.indexOf("?");
  const queryString = queryIndex >= 0 ? normalized.slice(queryIndex + 1) : "";

  return new URLSearchParams(queryString);
}

export default function ResetPasswordScreen() {
  const url = Linking.useURL();
  const params = useGlobalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);

  const tokenParams = useMemo(() => {
    const fromUrl = getParamsFromUrl(url);
    const fromRoute = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") {
        fromRoute.set(key, value);
      }
    }

    return {
      accessToken:
        fromUrl.get("access_token") || fromRoute.get("access_token"),
      refreshToken:
        fromUrl.get("refresh_token") || fromRoute.get("refresh_token"),
      type: fromUrl.get("type") || fromRoute.get("type"),
    };
  }, [params, url]);

  useEffect(() => {
    let mounted = true;

    async function prepareRecoverySession() {
      try {
        if (tokenParams.accessToken && tokenParams.refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: tokenParams.accessToken,
            refresh_token: tokenParams.refreshToken,
          });

          if (error) throw error;

          if (mounted) setRecoveryReady(true);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setRecoveryReady(!!data.session);
        }
      } catch (error: any) {
        Alert.alert("Reset link issue", mapAuthErrorMessage(error?.message));
      } finally {
        if (mounted) {
          setVerifyingSession(false);
        }
      }
    }

    prepareRecoverySession();

    return () => {
      mounted = false;
    };
  }, [tokenParams.accessToken, tokenParams.refreshToken]);

  async function handleUpdatePassword() {
    const passwordCheck = validatePassword(password);
    setPasswordError(passwordCheck.message);

    if (!passwordCheck.valid) {
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    setConfirmError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await supabase.auth.signOut();

      router.replace({
        pathname: "/",
        params: { message: "password-updated" },
      });
    } catch (error: any) {
      Alert.alert("Update failed", mapAuthErrorMessage(error?.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>PASSWORD RECOVERY</Text>
          <Text style={styles.heroTitle}>Choose a new password</Text>
          <Text style={styles.heroSubtitle}>
            Set a secure password for your Smart Notes AI account.
          </Text>
        </View>

        <GlassCard>
          <SectionHeader title="Update password" meta="SECURE SESSION" />

          {verifyingSession ? (
            <Text style={styles.helperText}>
              Checking your recovery session...
            </Text>
          ) : !recoveryReady ? (
            <>
              <Text style={styles.helperText}>
                This reset link is invalid or expired. Request a new password
                reset email and try again.
              </Text>
              <InlineTextButton
                label="Request a new reset link"
                onPress={() => router.replace("/forgot-password")}
              />
            </>
          ) : (
            <>
              <AppInput
                placeholder="New password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (passwordError) setPasswordError(null);
                }}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                error={passwordError}
              />

              <AppInput
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (confirmError) setConfirmError(null);
                }}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                error={confirmError}
              />

              <PrimaryButton
                label="Update password"
                loading={loading}
                disabled={!password.trim() || !confirmPassword.trim()}
                onPress={handleUpdatePassword}
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
  helperText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
});