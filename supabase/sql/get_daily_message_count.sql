-- Function to get daily message count for the current user
-- based on Brazilian Timezone (UTC-3)
create or replace function get_daily_message_count()
returns integer
language plpgsql
security definer
as $$
declare
  daily_count integer;
  start_of_day timestamp with time zone;
begin
  -- Calculate start of day in Brazil (UTC-3)
  -- 1. Get current time in UTC
  -- 2. Subtract 3 hours to get Brazil local time
  -- 3. Truncate to start of day (00:00)
  -- 4. Add 3 hours back to get the UTC timestamp for Brazil's midnight
  start_of_day := date_trunc('day', now() - interval '3 hours') + interval '3 hours';

  -- Count messages for the current user created after the start of the day
  select count(*)
  into daily_count
  from messages m
  join chats c on m.chat_id = c.id
  where c.user_id = auth.uid()
  and m.role = 'user'
  and m.created_at >= start_of_day;

  return daily_count;
end;
$$;
