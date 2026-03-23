import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: receipt, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !receipt) {
    return Response.json({ error: "Receipt not found" }, { status: 404 });
  }

  const { data: lineItems } = await supabase
    .from("line_items")
    .select("*")
    .eq("receipt_id", id);

  return Response.json({ ...receipt, line_items: lineItems ?? [] });
}
