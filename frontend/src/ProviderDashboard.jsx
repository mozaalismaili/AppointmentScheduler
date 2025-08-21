import { useEffect, useMemo, useState } from "react";
import Calendar from "./components/Calendar";
import { fetchAppointments, cancelAppointment, rescheduleAppointment } from "./api"; // ⬅️ import actions
import "./ProviderDashboard.css";

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d)   { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function fmtKey(d)       { return d.toISOString().slice(0,10); }

export default function ProviderDashboard() {
  const [cursor, setCursor] = useState(startOfMonth(new Date()));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(fmtKey(new Date()));
  const [banner, setBanner] = useState("");

  const ym = useMemo(() => ({ y: cursor.getFullYear(), m: cursor.getMonth() }), [cursor]);

  async function loadRange(cur = cursor) {
    const from = startOfMonth(cur);
    const to   = endOfMonth(cur);
    setLoading(true);
    try { setEvents(await fetchAppointments(from, to)); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadRange(cursor); }, [cursor]);

  const eventsForSelected = useMemo(
    () => events.filter(e => e.date === selectedDay).sort((a,b) => a.start.localeCompare(b.start)),
    [events, selectedDay]
  );

  const upcoming = useMemo(() => {
    const today = fmtKey(new Date());
    return events.filter(e => e.date >= today)
      .sort((a,b) => (a.date + a.start).localeCompare(b.date + b.start))
      .slice(0, 8);
  }, [events]);

  /* ---------- provider actions ---------- */
  async function handleCancel(id) {
    if (!confirm("Cancel this appointment?")) return;
    await cancelAppointment(id);
    setBanner("Appointment cancelled.");
    await loadRange();
  }

  async function handleReschedule(id, current) {
    const newDate = prompt("New date (YYYY-MM-DD):", current.date);
    const newTime = prompt("New time (HH:MM):", current.start);
    if (!newDate || !newTime) return;
    await rescheduleAppointment(id, { date: newDate, time: newTime });
    setBanner("Appointment rescheduled.");
    await loadRange();
  }

  return (
    <div className="bp-bg pd-bg">
      <div className="bp-decor-1" />
      <div className="bp-decor-2" />

      <main className="bp-shell pd-shell">
        <header className="pd-header">
          <div>
            <h1>Provider Dashboard</h1>
            <p>Stay on top of today and what’s coming next.</p>
          </div>
          <div className="pd-tools">
            <button className="pd-btn" onClick={() => setCursor(startOfMonth(new Date()))}>Today</button>
            <div className="pd-nav">
              <button className="pd-icon" aria-label="Previous month" onClick={() => setCursor(c => addMonths(c, -1))}>‹</button>
              <button className="pd-icon" aria-label="Next month" onClick={() => setCursor(c => addMonths(c, 1))}>›</button>
            </div>
          </div>
        </header>

        {banner && <div className="pd-banner">{banner}</div>}

        <div className="pd-grid">
          {/* Calendar */}
          <section className="bp-card pd-card pd-card--calendar">
            <Calendar
              year={ym.y}
              month={ym.m}
              events={events}
              onSelectDate={setSelectedDay}
            />
            {loading && <div className="pd-loading">Loading…</div>}
          </section>

          {/* Side panels */}
          <aside className="pd-side">
            {/* Selected day */}
            <section className="bp-card pd-card">
              <div className="pd-section-head">
                <h2>Selected Day</h2>
                <span className="pd-date">{selectedDay}</span>
              </div>

              {eventsForSelected.length === 0 ? (
                <div className="pd-empty">No appointments.</div>
              ) : (
                <ul className="pd-list">
                  {eventsForSelected.map(e => (
                    <li key={e.id} className="pd-item">
                      <div className="pd-time">{e.start}–{e.end}</div>
                      <div className="pd-title" title={e.title || "Appointment"}>{e.title || "Appointment"}</div>
                      <div className="pd-actions">
                        <span className={`pd-chip ${chipClass(e.status)}`}>{labelStatus(e.status)}</span>
                        <button className="pd-btn pd-btn--ghost" onClick={() => handleReschedule(e.id, e)}>Reschedule</button>
                        <button className="pd-btn pd-btn--danger" onClick={() => handleCancel(e.id)}>Cancel</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Upcoming */}
            <section className="bp-card pd-card">
              <div className="pd-section-head">
                <h2>Upcoming (next 8)</h2>
              </div>

              {upcoming.length === 0 ? (
                <div className="pd-empty">Nothing scheduled.</div>
              ) : (
                <ul className="pd-list">
                  {upcoming.map(e => (
                    <li key={e.id} className="pd-item pd-item--compact">
                      <div className="pd-date">{e.date}</div>
                      <div className="pd-time">{e.start}–{e.end}</div>
                      <div className="pd-title" title={e.title || "Appointment"}>{e.title || "Appointment"}</div>
                      <div className="pd-actions">
                        <span className={`pd-chip ${chipClass(e.status)}`}>{labelStatus(e.status)}</span>
                        <button className="pd-btn pd-btn--ghost" onClick={() => handleReschedule(e.id, e)}>Reschedule</button>
                        <button className="pd-btn pd-btn--danger" onClick={() => handleCancel(e.id)}>Cancel</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ------------ helpers for status chips ------------ */
function chipClass(status="") {
  const s = String(status).toLowerCase();
  if (s.includes("cancel"))   return "pd-chip--err";
  if (s.includes("complete")) return "pd-chip--ok";
  if (s.includes("pending"))  return "pd-chip--warn";
  return "pd-chip--info";
}
function labelStatus(status="booked"){
  const s = String(status).toLowerCase();
  if (s.includes("cancel"))   return "Cancelled";
  if (s.includes("complete")) return "Completed";
  if (s.includes("pending"))  return "Pending";
  return "Booked";
}
