const crypto = require("crypto");

async function supabaseFetch(path, options = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials are not configured.");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Supabase request failed.");
  return data;
}

async function confirmHold(holdId, paymentId) {
  return supabaseFetch("rpc/confirm_booking_hold_safe", {
    method: "POST",
    body: JSON.stringify({ p_hold_id: holdId, p_razorpay_payment_id: paymentId })
  });
}

async function bookingByPayment(paymentId) {
  const rows = await supabaseFetch(`bookings?payment_id=eq.${encodeURIComponent(paymentId)}&select=id&limit=1`);
  return rows?.[0]?.id || null;
}

async function createBookingFromPaidHold(hold, paymentId) {
  const existing = await bookingByPayment(paymentId);
  if (existing) return existing;
  const rows = await supabaseFetch("bookings", {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify({
      room_id: hold.room_id,
      customer_name: hold.customer_name || "Customer",
      customer_phone: hold.customer_phone || "N/A",
      customer_email: hold.customer_email || null,
      check_in: hold.check_in,
      check_out: hold.check_out,
      num_rooms: hold.num_rooms,
      num_adults: hold.num_adults,
      num_kids: hold.num_kids,
      total_price: hold.total_price,
      owner_amount: hold.owner_amount,
      profit_amount: hold.profit_amount,
      status: "confirmed",
      payment_option: hold.payment_option,
      payment_id: paymentId,
      influencer_id: hold.influencer_id || null,
      firecamp: Boolean(hold.firecamp)
    })
  });
  const bookingId = rows?.[0]?.id;
  if (!bookingId) throw new Error("Paid webhook fallback did not return a booking.");
  await supabaseFetch(`booking_holds?id=eq.${hold.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "confirmed", razorpay_payment_id: paymentId })
  });
  return bookingId;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(raw)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(req.headers["x-razorpay-signature"] || ""));
  if (
    !process.env.RAZORPAY_WEBHOOK_SECRET ||
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return res.status(400).json({ error: "Invalid webhook signature." });
  }

  try {
    const event = JSON.parse(raw);
    const payment = event?.payload?.payment?.entity;
    if (!payment?.order_id || !payment?.id || !["payment.captured", "order.paid"].includes(event.event)) {
      return res.status(200).json({ ok: true });
    }
    const holds = await supabaseFetch(`booking_holds?razorpay_order_id=eq.${payment.order_id}&select=*&limit=1`);
    const hold = holds?.[0];
    if (!hold || hold.status === "confirmed") return res.status(200).json({ ok: true });
    try {
      await confirmHold(hold.id, payment.id);
    } catch (error) {
      console.error("Webhook confirm hold failed after captured payment:", error.message);
      await createBookingFromPaidHold(hold, payment.id);
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook failed:", error.message);
    res.status(400).json({ error: "Webhook failed." });
  }
};
