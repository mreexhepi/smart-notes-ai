import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#f4f7fb" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="forgot-password" options={{ presentation: "modal" }} />
        <Stack.Screen name="reset-password" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
