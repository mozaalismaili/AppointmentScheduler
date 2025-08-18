import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./BookingPage.css";

// --- Schema ---
const phoneRegex = /^(\+?\d[\d\s-]{7,15})$/;
const BookingSchema = z.object({
  service: z.string().min(1, "Select a service"),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  name: z.string().min(2, "Name is too short"),
  phone: z
    .string()
    .min(7, "Phone is too short")
    .regex(phoneRegex, "Enter a valid phone number"),
  notes: z.string().max(500, "Max 500 characters").optional(),
  company: z.string().optional(), // honeypot
});

// --- Utils ---
function getApiBaseUrl(explicit) {
  if (explicit) return explicit;
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    if (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) {
      return process.env.REACT_APP_API_BASE_URL;
    }
  } catch {}
  return "/api";
}
function toLocalMinDateStr() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function isPastDateTime(dateStr, timeStr) {
  try {
    const [h, m] = timeStr.split(":").map(Number);
    const dt = new Date(
      `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
    );
    return dt.getTime() < Date.now();
  } catch {
    return false;
  }
}
async function createBooking(apiBaseUrl, payload, idempotencyKey) {
  const res = await fetch(`${apiBaseUrl}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = "";
    try {
      const data = await res.json();
      msg = data?.message || data?.error || "";
    } catch {}
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return res.json();
}
function newIdempotencyKey() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();
}

/** Local slot generator (fallback if /api/availability is missing) */
function generateSlots(dateStr, start = "09:00", end = "17:00", stepMin = 30) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const all = [];
  for (let t = startMin; t < endMin; t += stepMin) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    all.push(`${h}:${m}`);
  }
  return all;
}

/** Normalize various availability API shapes to a boolean map */
function normalizeAvailability(dateStr, data) {
  // Supports:
  // { slots: ["09:00"], booked: ["10:00"] }
  // { available: ["09:00"], unavailable: ["10:00"] }
  // { times: [{time:"09:00", available:true}, ...] }
  const set = new Set();
  let all = [];

  if (Array.isArray(data?.slots)) {
    all = data.slots;
    (data.booked || data.unavailable || []).forEach((t) => set.add(t));
  } else if (Array.isArray(data?.available) || Array.isArray(data?.unavailable)) {
    all = (data.available || []).concat(data.unavailable || []);
    (data.unavailable || []).forEach((t) => set.add(t));
  } else if (Array.isArray(data?.times)) {
    all = data.times.map((x) => x.time);
    data.times.forEach((x) => {
      if (!x.available) set.add(x.time);
    });
  }

  if (all.length === 0) all = generateSlots(dateStr);

  const map = {};
  all.forEach((t) => {
    const past = isPastDateTime(dateStr, t);
    map[t] = !(set.has(t) || past);
  });
  return map;
}

// --- Component ---
export default function BookingPage({
  services = ["Consultation", "Follow-up", "Support"],
  apiBaseUrl,
}) {
  const minDate = toLocalMinDateStr();
  const resolvedApi = useMemo(() => getApiBaseUrl(apiBaseUrl), [apiBaseUrl]);
  const [banner, setBanner] = useState({ kind: "success", text: "" });

  // availability state
  const [slots, setSlots] = useState([]); // [{time:"09:00", available:true}, ...]
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      service: "",
      date: "",
      time: "",
      name: "",
      phone: "",
      notes: "",
      company: "",
    },
    mode: "onBlur",
  });

  const dateVal = watch("date");

  // Load availability when date changes
  useEffect(() => {
    if (!dateVal) {
      setSlots([]);
      setSelectedTime("");
      setValue("time", "");
      return;
    }
    setSelectedTime("");
    setValue("time", "");
    setLoadingSlots(true);

    (async () => {
      try {
        const r = await fetch(`${resolvedApi}/availability?date=${dateVal}`);
        if (r.ok) {
          const data = await r.json();
          const map = normalizeAvailability(dateVal, data);
          const arr = Object.keys(map)
            .sort()
            .map((t) => ({ time: t, available: map[t] }));
          setSlots(arr);
        } else {
          const arr = generateSlots(dateVal).map((t) => ({
            time: t,
            available: !isPastDateTime(dateVal, t),
          }));
          setSlots(arr);
        }
      } catch {
        const arr = generateSlots(dateVal).map((t) => ({
          time: t,
          available: !isPastDateTime(dateVal, t),
        }));
        setSlots(arr);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [dateVal, resolvedApi, setValue]);

  function chooseSlot(t) {
    setSelectedTime(t);
    setValue("time", t, { shouldValidate: true });
  }

  async function onSubmit(values) {
    setBanner({ kind: "success", text: "" });

    // honeypot
    if (values.company && values.company.trim() !== "") {
      reset();
      setBanner({ kind: "success", text: "Thanks! We will confirm your booking shortly." });
      return;
    }

    if (values.date && values.time && isPastDateTime(values.date, values.time)) {
      setBanner({ kind: "error", text: "Selected time is in the past. Please pick a future time." });
      return;
    }

    const payload = {
      service: values.service,
      date: values.date,
      time: values.time,
      name: values.name,
      phone: values.phone,
      notes: values.notes || undefined,
    };

    try {
      const idKey = newIdempotencyKey();
      const data = await createBooking(resolvedApi, payload, idKey);
      // block the slot in the current view
      setSlots((prev) =>
        prev.map((s) => (s.time === values.time ? { ...s, available: false } : s))
      );
      setSelectedTime("");
      reset({
        service: values.service,
        date: values.date,
        time: "",
        name: "",
        phone: "",
        notes: "",
        company: "",
      });
      setBanner({ kind: "success", text: data?.message || "✅ Booking created! We’ll contact you soon." });
    } catch (err) {
      setBanner({ kind: "error", text: err.message || "Could not submit. Try again." });
    }
  }

  return (
    <div className="bp-bg">
      <div className="bp-decor-1" />
      <div className="bp-decor-2" />

      <main className="bp-shell" aria-live="polite">
        <header className="bp-header">
          <h1>Book an Appointment</h1>
          <p>Pick a service, choose a date, select an available time slot, and tell us how to reach you.</p>
        </header>

        {banner.text && (
          <div className={`bp-banner ${banner.kind === "error" ? "bp-banner--error" : "bp-banner--ok"}`}>
            {banner.text}
          </div>
        )}

        <section className="bp-card" aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">Booking form</h2>

          <form className="bp-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Service */}
            <div className="bp-field">
              <label htmlFor="service" className="bp-label">
                <span className="bp-ico" aria-hidden>🛎️</span> Service
              </label>
              <select id="service" className="bp-select" {...register("service")} aria-invalid={!!errors.service}>
                <option value="">Select…</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.service && <p className="bp-error">{errors.service.message}</p>}
            </div>

            {/* Date */}
            <div className="bp-field">
              <label htmlFor="date" className="bp-label">
                <span className="bp-ico" aria-hidden>📅</span> Date
              </label>
              <input
                id="date"
                type="date"
                min={minDate}
                className="bp-input"
                {...register("date")}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="bp-error">{errors.date.message}</p>}
            </div>

            {/* Time slots (appears after choosing a date) */}
            {dateVal && (
              <div className="bp-field">
                <label className="bp-label">
                  <span className="bp-ico" aria-hidden>⏰</span> Time (30-minute slots)
                </label>

                {loadingSlots ? (
                  <p className="bp-hint">Loading available slots…</p>
                ) : (
                  <div className="bp-slots" role="listbox" aria-label="Available time slots">
                    {slots.map(({ time, available }) => (
                      <button
                        key={time}
                        type="button"
                        className={`bp-slot ${selectedTime === time ? "bp-slot--selected" : ""}`}
                        disabled={!available}
                        aria-pressed={selectedTime === time}
                        onClick={() => chooseSlot(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                {/* keep the real form field, but hidden (slot picker writes to it) */}
                <input type="hidden" {...register("time")} value={selectedTime} readOnly />
                {errors.time && <p className="bp-error">{errors.time.message}</p>}
                <p className="bp-hint">Unavailable and past-time slots are disabled automatically.</p>
              </div>
            )}

            {/* Contact */}
            <div className="bp-row">
              <div className="bp-field">
                <label htmlFor="name" className="bp-label">
                  <span className="bp-ico" aria-hidden>👤</span> Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="bp-input"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="bp-error">{errors.name.message}</p>}
              </div>
              <div className="bp-field">
                <label htmlFor="phone" className="bp-label">
                  <span className="bp-ico" aria-hidden>📱</span> Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+968…"
                  className="bp-input"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="bp-error">{errors.phone.message}</p>}
                <p className="bp-hint">We’ll use this to confirm your booking.</p>
              </div>
            </div>

            {/* Notes */}
            <div className="bp-field">
              <label htmlFor="notes" className="bp-label">
                <span className="bp-ico" aria-hidden>📝</span> Notes (optional)
              </label>
              <textarea
                id="notes"
                placeholder="Anything we should know?"
                className="bp-textarea"
                {...register("notes")}
              />
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" className="sr-only">
              <label>
                Company <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
              </label>
            </div>

            <button type="submit" className={`bp-btn ${isSubmitting ? "bp-btn--busy" : ""}`} disabled={isSubmitting}>
              <span className="bp-btn__spinner" aria-hidden />
              {isSubmitting ? "Submitting…" : "Confirm Booking"}
            </button>

            <p className="bp-terms">
              By confirming, you agree to our appointment policy. You’ll receive a confirmation by SMS/WhatsApp.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
