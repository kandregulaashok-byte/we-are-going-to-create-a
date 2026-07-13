drop policy if exists "bookings owner update" on public.bookings;

create policy "bookings owner update"
on public.bookings for update
to authenticated
using (
  status = 'offline_blocked'
  and exists (
    select 1 from public.rooms
    where rooms.id = bookings.room_id
      and rooms.owner_id = auth.uid()
  )
)
with check (status = 'cancelled');
