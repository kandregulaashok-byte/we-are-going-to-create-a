-- Run this in Supabase SQL Editor after exporting important tables.
-- Fixes customer booking data exposure while keeping admin/owner dashboards working.

alter table public.bookings enable row level security;

drop policy if exists "bookings public read" on public.bookings;
drop policy if exists "bookings public insert" on public.bookings;
drop policy if exists "bookings owner modify" on public.bookings;
drop policy if exists "bookings admin all" on public.bookings;
drop policy if exists "bookings owner read" on public.bookings;
drop policy if exists "bookings owner update" on public.bookings;
drop policy if exists "bookings customer read" on public.bookings;

create policy "bookings admin all"
on public.bookings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "bookings customer read"
on public.bookings for select
to authenticated
using (customer_email = (auth.jwt() ->> 'email'));

create policy "bookings owner read"
on public.bookings for select
to authenticated
using (
  exists (
    select 1 from public.rooms
    where rooms.id = bookings.room_id
      and rooms.owner_id = auth.uid()
  )
);

create policy "bookings owner update"
on public.bookings for update
to authenticated
using (
  exists (
    select 1 from public.rooms
    where rooms.id = bookings.room_id
      and rooms.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.rooms
    where rooms.id = bookings.room_id
      and rooms.owner_id = auth.uid()
  )
);

revoke insert on public.bookings from anon;
revoke select on public.bookings from anon;
revoke update on public.bookings from anon;
revoke delete on public.bookings from anon;

grant select on public.bookings to authenticated;
grant update(status, booking_confirmation_status, last_contact_attempt_at) on public.bookings to authenticated;

revoke all on function public.create_booking_safe(uuid, text, text, text, date, date, integer, integer, integer, text, text, uuid, boolean) from public;
grant execute on function public.create_booking_safe(uuid, text, text, text, date, date, integer, integer, integer, text, text, uuid, boolean) to authenticated, service_role;
