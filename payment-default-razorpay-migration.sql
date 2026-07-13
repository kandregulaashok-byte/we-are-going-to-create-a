insert into public.site_settings (key, value)
values ('payment', '{"mode": "razorpay", "upiId": ""}'::jsonb)
on conflict (key) do nothing;

update public.site_settings
set value = coalesce(value, '{}'::jsonb) || '{"mode": "razorpay"}'::jsonb
where key = 'payment'
  and coalesce(value ->> 'mode', '') in ('', 'mock');

create or replace function public.get_payment_settings()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select value from public.site_settings where key = 'payment'),
    '{"mode": "razorpay", "upiId": ""}'::jsonb
  );
$$;

grant execute on function public.get_payment_settings() to anon, authenticated;
