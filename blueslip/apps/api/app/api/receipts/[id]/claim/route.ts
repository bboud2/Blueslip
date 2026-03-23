import { createClient } from "@supabase/supabase-js";
import { ClaimReceiptRequest } from "@blueslip/shared";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: ClaimReceiptRequest = await request.json();

  const { data: existing } = await supabase
    .from("receipts")
    .select("device_id")
    .eq("id", id)
    .single();

  if (!existing) {
    return Response.json({ error: "Receipt not found" }, { status: 404 });
  }

  if (existing.device_id && existing.device_id !== body.device_id) {
    return Response.json(
      { error: "Receipt already claimed by another device" },
      { status: 409 }
    );
  }

  const { data: receipt, error } = await supabase
    .from("receipts")
    .update({ device_id: body.device_id })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(receipt);
}
