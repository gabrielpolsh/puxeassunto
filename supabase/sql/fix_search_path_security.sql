-- Fix mutable search_path for all functions
-- Isso previne ataques de "search path injection"

-- 1. Fix handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix get_daily_message_count
CREATE OR REPLACE FUNCTION public.get_daily_message_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_count integer;
  start_of_day timestamp with time zone;
BEGIN
  -- Calculate start of day in Brazil (UTC-3)
  start_of_day := date_trunc('day', now() - interval '3 hours') + interval '3 hours';

  -- Count messages for the current user created after the start of the day
  SELECT count(*)
  INTO daily_count
  FROM messages m
  JOIN chats c ON m.chat_id = c.id
  WHERE c.user_id = auth.uid()
  AND m.role = 'user'
  AND m.created_at >= start_of_day;

  RETURN daily_count;
END;
$$;

-- 3. Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_pro)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
