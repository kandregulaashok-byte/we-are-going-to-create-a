alter table public.bookings
add column if not exists confirmation_email_sent_at timestamptz;
