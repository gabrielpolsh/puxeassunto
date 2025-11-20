-- Add updated_at column to profiles table
alter table profiles 
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Create a trigger to automatically update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to the profiles table
drop trigger if exists on_profiles_updated on profiles;
create trigger on_profiles_updated
  before update on profiles
  for each row execute procedure public.handle_updated_at();
