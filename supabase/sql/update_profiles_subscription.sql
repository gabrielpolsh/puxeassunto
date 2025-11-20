-- Add subscription tracking columns to profiles table
alter table profiles 
add column if not exists subscription_id text,
add column if not exists subscription_status text, -- 'active', 'canceled', 'past_due', etc.
add column if not exists next_payment_date timestamp with time zone,
add column if not exists plan_type text default 'monthly'; -- 'monthly', 'yearly'
