alter table public.bookings add column if not exists booking_confirmation_status text not null default 'not_contacted';
alter table public.bookings add column if not exists last_contact_attempt_at timestamptz;

grant update(status, booking_confirmation_status, last_contact_attempt_at) on public.bookings to authenticated;

drop view if exists public.admin_bookings;
create view public.admin_bookings as
select
  b.*,
  r.room_name,
  r.room_type,
  coalesce(o.hotel_name, r.room_name) as hotel_name,
  o.owner_name,
  o.phone as owner_phone
from public.bookings b
left join public.rooms r on r.id = b.room_id
left join public.hotel_owners o on o.id = r.owner_id
where public.is_admin();

grant select on public.admin_bookings to authenticated;
