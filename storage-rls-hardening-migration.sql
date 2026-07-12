-- Run in Supabase SQL Editor.
-- Keeps room images publicly readable, but write access admin-only.

insert into storage.buckets (id, name, public)
values ('room-images', 'room-images', true)
on conflict (id) do update set public = true;

drop policy if exists "room images prototype write" on storage.objects;
drop policy if exists "room images admin write" on storage.objects;
drop policy if exists "room images public read" on storage.objects;

create policy "room images public read"
on storage.objects for select
using (bucket_id = 'room-images');

create policy "room images admin write"
on storage.objects for all
to authenticated
using (bucket_id = 'room-images' and public.is_admin())
with check (bucket_id = 'room-images' and public.is_admin());

alter table public.bookings enable row level security;
revoke insert, update, delete on public.bookings from anon;
revoke select on public.bookings from anon;
