import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: receipt, error } = await supabase
    .from("receipts")
    .select("*")
    .is("device_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !receipt) {
    return Response.json(
      { error: "No unclaimed receipts found" },
      { status: 404 }
    );
  }

  const { data: lineItems } = await supabase
    .from("line_items")
    .select("*")
    .eq("receipt_id", receipt.id);

  return Response.json({ ...receipt, line_items: lineItems ?? [] });
}
