const defaultPricingSettings = {
  occupancy80Surcharge: 200,
  occupancy90Surcharge: 300
};

function getStoredPricingSettings() {
  try {
    return JSON.parse(localStorage.getItem("stayPricingSettings")) || defaultPricingSettings;
  } catch {
    return defaultPricingSettings;
  }
}

function normalizePricingSettings(settings = {}) {
  return {
    occupancy80Surcharge: Math.max(0, Number(settings.occupancy80Surcharge ?? defaultPricingSettings.occupancy80Surcharge) || 0),
    occupancy90Surcharge: Math.max(0, Number(settings.occupancy90Surcharge ?? defaultPricingSettings.occupancy90Surcharge) || 0)
  };
}

function fillPricingForm(settings) {
  const normalized = normalizePricingSettings(settings);
  if (pricing80Surcharge) pricing80Surcharge.value = normalized.occupancy80Surcharge;
  if (pricing90Surcharge) pricing90Surcharge.value = normalized.occupancy90Surcharge;
}

function fillPaymentForm(settings) {
  if (paymentMode) paymentMode.value = ["manual", "mock", "razorpay"].includes(settings?.mode) ? settings.mode : "manual";
  if (paymentUpiId) paymentUpiId.value = settings?.upiId || "";
}

async function loadPricingSettings() {
  fillPricingForm(getStoredPricingSettings());
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("site_settings")
    .select("value")
    .eq("key", "dynamic_pricing")
    .maybeSingle();
  if (error) {
    setStatus(`Dynamic pricing table not ready: ${error.message}`);
    return;
  }
  const settings = normalizePricingSettings(data?.value);
  localStorage.setItem("stayPricingSettings", JSON.stringify(settings));
  fillPricingForm(settings);

  const { data: paymentData } = await supabaseClient
    .from("site_settings")
    .select("value")
    .eq("key", "payment")
    .maybeSingle();
  fillPaymentForm(paymentData?.value || { mode: "mock" });
}

async function savePricingSettings(event) {
  event.preventDefault();
  const settings = normalizePricingSettings({
    occupancy80Surcharge: pricing80Surcharge?.value,
    occupancy90Surcharge: pricing90Surcharge?.value
  });
  localStorage.setItem("stayPricingSettings", JSON.stringify(settings));
  if (!supabaseClient) {
    setStatus("Saved pricing settings locally.");
    return;
  }
  const { error } = await supabaseClient
    .from("site_settings")
    .upsert({ key: "dynamic_pricing", value: settings, updated_at: new Date().toISOString() });
  if (error) return notifyAdmin(`Pricing save failed: ${error.message}`, true);
  notifyAdmin("Dynamic pricing settings saved.");
}

async function savePaymentSettings(event) {
  event.preventDefault();
  if (!supabaseClient) return notifyAdmin("Supabase is not connected. Payment mode was not saved.", true);
  const value = { mode: paymentMode.value, upiId: paymentUpiId?.value?.trim() || "" };
  if (value.mode === "manual" && !value.upiId) return notifyAdmin("Enter UPI ID before saving manual payment mode.", true);
  const button = adminPaymentForm.querySelector("button[type='submit']");
  const resetButton = () => {
    if (button) {
      button.disabled = false;
      button.textContent = "Save Payment Mode";
    }
  };
  if (button) {
    button.disabled = true;
    button.textContent = "Saving...";
  }
  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const response = await withTimeout(fetch("/api/payment-settings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${sessionData.session?.access_token || ""}`
      },
      body: JSON.stringify(value)
    }));
    const saved = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(saved.error || "Payment settings were not saved.");
    fillPaymentForm(saved);
    resetButton();
    notifyAdmin(`Payment settings saved. Mode: ${value.mode}${value.upiId ? `, UPI: ${value.upiId}` : ""}.`);
  } catch (error) {
    resetButton();
    notifyAdmin(`Payment mode save failed: ${error.message}`, true);
  } finally {
    resetButton();
  }
}
