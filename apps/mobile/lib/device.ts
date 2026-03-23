import * as SecureStore from "expo-secure-store";
import { randomUUID } from "expo-crypto";

const DEVICE_ID_KEY = "blueslip_device_id";

export async function getDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = randomUUID();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}
