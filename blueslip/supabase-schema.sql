-- supabase-schema.sql
-- Run this in the Supabase SQL Editor

create table receipts (
  id uuid primary key default gen_random_uuid(),
  device_id text,
  store_name text not null,
  store_address text not null,
  subtotal integer not null,
  tax integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create table line_items (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references receipts(id) on delete cascade,
  name text not null,
  quantity integer not null,
  unit_price integer not null
);

create index idx_receipts_device_id on receipts(device_id);
create index idx_receipts_created_at on receipts(created_at desc);
create index idx_line_items_receipt_id on line_items(receipt_id);
