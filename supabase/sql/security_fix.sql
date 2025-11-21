-- 1. FIX PROFILES PRIVACY
-- Currently everyone can see everyone's email. Let's fix that.
drop policy "Public profiles are viewable by everyone." on profiles;

create policy "Users can only see their own profile"
  on profiles for select
  using ( auth.uid() = id );

-- 2. SECURE CHATS TABLE
-- Ensure RLS is enabled
alter table chats enable row level security;

-- Create policies for chats if they don't exist
create policy "Users can view their own chats"
  on chats for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own chats"
  on chats for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own chats"
  on chats for delete
  using ( auth.uid() = user_id );

-- 3. SECURE MESSAGES TABLE
-- Ensure RLS is enabled
alter table messages enable row level security;

-- Create policies for messages
-- We need to join with chats to check ownership, which can be expensive or complex in RLS.
-- A common pattern is to denormalize user_id to messages OR use a subquery.
-- Assuming messages has chat_id:

create policy "Users can view messages from their chats"
  on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

create policy "Users can insert messages into their chats"
  on messages for insert
  with check (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );
