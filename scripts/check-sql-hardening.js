const fs = require("fs");

const files = [
  "security-hardening-rls-migration.sql",
  "security-hardening-booking-rpc-migration.sql",
  "storage-rls-hardening-migration.sql",
  "supabase-schema.sql"
].map(file => fs.readFileSync(file, "utf8").toLowerCase()).join("\n");

const required = [
  "enable row level security",
  "create_booking_hold_safe",
  "confirm_booking_hold_safe",
  "room images admin write",
  "public.is_admin()",
  "revoke select on public.bookings from anon"
];

for (const text of required) {
  if (!files.includes(text)) throw new Error(`SQL hardening missing: ${text}`);
}

console.log("sql hardening check passed");
