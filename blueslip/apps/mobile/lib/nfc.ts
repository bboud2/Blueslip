import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

export async function initNfc(): Promise<boolean> {
  const supported = await NfcManager.isSupported();
  if (supported) {
    await NfcManager.start();
  }
  return supported;
}

export async function readNfcTag(): Promise<string | null> {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();

    if (!tag?.ndefMessage?.[0]) return null;

    const record = tag.ndefMessage[0];
    const url = Ndef.uri.decodePayload(new Uint8Array(record.payload));
    return url;
  } catch {
    return null;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
