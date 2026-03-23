import { useEffect } from "react";
import { Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useFonts, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { initNfc, readNfcTag } from "../lib/nfc";
import { getLatestReceipt, claimReceipt } from "../lib/api";
import { getDeviceId } from "../lib/device";
import { colors } from "../lib/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

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

  useEffect(() => {
    let scanning = true;

    async function startNfcLoop() {
      const supported = await initNfc();
      if (!supported) return;

      while (scanning) {
        const url = await readNfcTag();
        if (!url || !scanning) continue;

        try {
          const receipt = await getLatestReceipt();
          if (!receipt) {
            Alert.alert("No receipt", "No new receipt available.");
            continue;
          }

          const deviceId = await getDeviceId();
          await claimReceipt(receipt.id, deviceId);
          router.push(`/receipt/${receipt.id}`);
        } catch {
          Alert.alert("Error", "Failed to claim receipt.");
        }
      }
    }

    startNfcLoop();

    return () => {
      scanning = false;
    };
  }, [router]);

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
