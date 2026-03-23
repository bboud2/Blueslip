import { Receipt, CreateReceiptRequest, ClaimReceiptRequest } from "@blueslip/shared";

const API_URL = "https://your-vercel-domain.vercel.app"; // update after deploy

export async function getLatestReceipt(): Promise<Receipt | null> {
  const res = await fetch(`${API_URL}/api/receipts/latest`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch latest receipt");
  return res.json();
}

export async function claimReceipt(
  receiptId: string,
  deviceId: string
): Promise<Receipt> {
  const res = await fetch(`${API_URL}/api/receipts/${receiptId}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_id: deviceId } satisfies ClaimReceiptRequest),
  });
  if (!res.ok) throw new Error("Failed to claim receipt");
  return res.json();
}

export async function getDeviceReceipts(
  deviceId: string
): Promise<Receipt[]> {
  const res = await fetch(`${API_URL}/api/devices/${deviceId}/receipts`);
  if (!res.ok) throw new Error("Failed to fetch receipts");
  return res.json();
}

export async function getReceipt(id: string): Promise<Receipt> {
  const res = await fetch(`${API_URL}/api/receipts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch receipt");
  return res.json();
}
