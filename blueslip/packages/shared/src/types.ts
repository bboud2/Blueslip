export interface LineItem {
  id: string;
  receipt_id: string;
  name: string;
  quantity: number;
  unit_price: number; // cents
}

export interface Receipt {
  id: string;
  device_id: string | null;
  store_name: string;
  store_address: string;
  subtotal: number; // cents
  tax: number;      // cents
  total: number;    // cents
  created_at: string;
  line_items?: LineItem[];
}

// API request types
export interface CreateReceiptRequest {
  store_name: string;
  store_address: string;
  subtotal: number;
  tax: number;
  total: number;
  line_items: Omit<LineItem, "id" | "receipt_id">[];
}

export interface ClaimReceiptRequest {
  device_id: string;
}
