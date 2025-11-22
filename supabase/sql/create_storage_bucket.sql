-- Create the storage bucket 'puxeassunto' if it doesn't exist
insert into storage.buckets (id, name, public)
values ('puxeassunto', 'puxeassunto', true)
on conflict (id) do nothing;

-- Note: We removed 'alter table storage.objects enable row level security;' 
-- because it requires owner permissions and is usually already enabled.

-- Drop policies if they already exist to avoid errors on retry
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated users can upload" on storage.objects;
drop policy if exists "Users can update their own files" on storage.objects;
drop policy if exists "Users can delete their own files" on storage.objects;

-- Policy: Allow public read access to files in 'puxeassunto' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'puxeassunto' );

-- Policy: Allow authenticated users to upload files to 'puxeassunto' bucket
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'puxeassunto' and auth.role() = 'authenticated' );

-- Policy: Allow users to update their own files
create policy "Users can update their own files"
  on storage.objects for update
  using ( bucket_id = 'puxeassunto' and auth.uid() = owner );

-- Policy: Allow users to delete their own files
create policy "Users can delete their own files"
  on storage.objects for delete
  using ( bucket_id = 'puxeassunto' and auth.uid() = owner );
