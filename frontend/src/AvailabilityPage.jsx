import React, { useState } from "react";
import "./AvailabilityPage.css";
import { saveAvailability } from "./api";

export default function AvailabilityPage() {
  // Default highlight: Sun → Thu
  const [days, setDays] = useState({
    Sun: true, Mon: true, Tue: true, Wed: true, Thu: true, Fri: false, Sat: false,
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime]   = useState("17:00");
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [banner, setBanner] = useState({ kind: "", text: "" });
  const [saving, setSaving] = useState(false);

  const toggle = (k) => setDays(d => ({ ...d, [k]: !d[k] }));

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner({ kind: "", text: "" });

    const chosen = Object.keys(days).filter(k => days[k]);
    if (chosen.length === 0) {
      setBanner({ kind: "error", text: "Please select at least one working day." });
      return;
    }
    if (startTime >= endTime) {
      setBanner({ kind: "error", text: "Start time must be before end time." });
      return;
    }

    const payload = {
      days: chosen,           // ["Sun","Mon",...]
      start: startTime,       // "HH:mm"
      end: endTime,           // "HH:mm"
      slotMinutes: Number(slotMinutes),
    };

    try {
      setSaving(true);
      await saveAvailability(payload);
      setBanner({ kind: "success", text: "Availability saved." });
    } catch (err) {
      setBanner({ kind: "error", text: err?.message || "Failed to save availability" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bp-bg">
      <div className="bp-decor-1" />
      <div className="bp-decor-2" />

      <main className="bp-shell" aria-live="polite">
        <header className="ap-header">
          <h1>Availability</h1>
          <p>Choose working days, hours, and slot duration.</p>
        </header>

        {banner.text && (
          <div className={`bp-banner ${banner.kind === "error" ? "bp-banner--err" : "bp-banner--ok"}`}>
            {banner.text}
          </div>
        )}

        <section className="bp-card ap-card" aria-labelledby="availability-title">
          <h2 id="availability-title" className="sr-only">Set availability</h2>

          <form className="bp-form ap-form" onSubmit={handleSubmit} noValidate>
            {/* Days */}
            <div className="bp-field">
              <label className="bp-label">Working days</label>
              <div className="ap-days" role="group" aria-label="Working days">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(k => (
                  <label key={k} className={`ap-day ${days[k] ? "ap-day--on" : ""}`}>
                    <input type="checkbox" checked={!!days[k]} onChange={() => toggle(k)} aria-label={k} />
                    <span>{k}</span>
                  </label>
                ))}
              </div>
              <p className="bp-hint">Tip: keep weekdays on, weekends optional.</p>
            </div>

            {/* Times + slot */}
            <div className="bp-row ap-row">
              <div>
                <label className="bp-label" htmlFor="start">Start time</label>
                <input
                  id="start"
                  type="time"
                  className="bp-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label className="bp-label" htmlFor="end">End time</label>
                <input
                  id="end"
                  type="time"
                  className="bp-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div>
                <label className="bp-label" htmlFor="slot">Slot (minutes)</label>
                <select
                  id="slot"
                  className="bp-select"
                  value={slotMinutes}
                  onChange={(e) => setSlotMinutes(e.target.value)}
                >
                  {[10,15,20,30,45,60].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={`bp-btn ${saving ? "bp-btn--busy" : ""}`}
              disabled={saving}
            >
              <span className="bp-btn__spinner" aria-hidden />
              {saving ? "Saving…" : "Save availability"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
