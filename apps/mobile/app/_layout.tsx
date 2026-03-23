import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "../lib/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surfaceContainer },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontFamily: "Manrope_700Bold", color: colors.onSurface },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "BlueSlip",
          headerTitleStyle: {
            fontFamily: "Manrope_800ExtraBold",
            fontSize: 22,
            color: colors.primary,
          },
        }}
      />
      <Stack.Screen
        name="receipt/[id]"
        options={{ title: "Receipt Detail" }}
      />
    </Stack>
  );
}
