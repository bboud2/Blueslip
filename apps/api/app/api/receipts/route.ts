import { createClient } from "@supabase/supabase-js";
import { CreateReceiptRequest } from "@blueslip/shared";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body: CreateReceiptRequest = await request.json();

  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      store_name: body.store_name,
      store_address: body.store_address,
      subtotal: body.subtotal,
      tax: body.tax,
      total: body.total,
    })
    .select()
    .single();

  if (receiptError) {
    return Response.json({ error: receiptError.message }, { status: 500 });
  }

  const lineItems = body.line_items.map((item) => ({
    receipt_id: receipt.id,
    name: item.name,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { data: items, error: itemsError } = await supabase
    .from("line_items")
    .insert(lineItems)
    .select();

  if (itemsError) {
    return Response.json({ error: itemsError.message }, { status: 500 });
  }

  return Response.json({ ...receipt, line_items: items }, { status: 201 });
}
