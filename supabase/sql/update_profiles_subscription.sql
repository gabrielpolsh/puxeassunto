-- Add subscription tracking columns to profiles table
alter table profiles 
add column if not exists subscription_id text,
add column if not exists subscription_status text, -- 'active', 'canceled', 'past_due', etc.
add column if not exists next_payment_date timestamp with time zone,
add column if not exists plan_type text default 'monthly'; -- 'monthly', 'quarterly', 'yearly'

-- Add subscription_end_date to track when the subscription expires
alter table profiles
add column if not exists subscription_end_date timestamp with time zone;

-- Function to calculate subscription end date based on plan type
-- This is used by the webhook to set the correct end date
create or replace function calculate_subscription_end_date(
    p_plan_type text,
    p_start_date timestamp with time zone default now()
)
returns timestamp with time zone as $$
begin
    case p_plan_type
        when 'monthly' then
            return p_start_date + interval '1 month';
        when 'quarterly' then
            return p_start_date + interval '3 months';
        when 'yearly' then
            return p_start_date + interval '1 year';
        else
            return p_start_date + interval '1 month'; -- default to monthly
    end case;
end;
$$ language plpgsql;

-- Function to check if a subscription is still valid
create or replace function is_subscription_active(p_user_id uuid)
returns boolean as $$
declare
    v_end_date timestamp with time zone;
    v_is_pro boolean;
begin
    select subscription_end_date, is_pro 
    into v_end_date, v_is_pro
    from profiles 
    where id = p_user_id;
    
    -- If user is marked as PRO and has no end date, they are active
    if v_is_pro and v_end_date is null then
        return true;
    end if;
    
    -- If user has an end date, check if it's in the future
    if v_end_date is not null then
        return v_end_date > now();
    end if;
    
    return v_is_pro;
end;
$$ language plpgsql;

-- Create index for faster lookups
create index if not exists idx_profiles_subscription_end_date 
on profiles(subscription_end_date) 
where subscription_end_date is not null;
