import React, { useState, useEffect, useMemo } from "react";
import Calendar from "./components/Calendar";
import { fetchAppointments, cancelAppointment, rescheduleAppointment, saveAvailability } from "./api";
import "./ProviderDashboard.css";

export default function ProviderDashboard() {
  const [tab, setTab] = useState("appointments"); // "appointments" | "availability"

  /** ---------- Appointments state ---------- */
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(formatDate(new Date()));
  const [banner, setBanner] = useState("");

  /** ---------- Availability state ---------- */
  const [days, setDays] = useState({
    Sun: true, Mon: true, Tue: true, Wed: true, Thu: true, Fri: false, Sat: false,
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [saving, setSaving] = useState(false);
  const [availBanner, setAvailBanner] = useState("");

  /** ---------- Helpers ---------- */
  function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
  function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
  function addMonths(d, n){ return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  function formatDate(d){ return d.toISOString().slice(0,10); }

  /** ---------- Load appointments ---------- */
  async function loadRange(cur = cursor) {
    setLoading(true);
    try {
      const from = startOfMonth(cur);
      const to = endOfMonth(cur);
      const data = await fetchAppointments(from, to);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if(tab==="appointments") loadRange(); }, [cursor, tab]);

  const eventsForSelected = useMemo(
    () => events.filter(e => e.date === selectedDay).sort((a,b) => a.start.localeCompare(b.start)),
    [events, selectedDay]
  );

  const upcoming = useMemo(() => {
    const today = formatDate(new Date());
    return events.filter(e => e.date >= today)
      .sort((a,b) => (a.date + a.start).localeCompare(b.date + b.start))
      .slice(0,8);
  }, [events]);

  /** ---------- Appointment actions ---------- */
  async function handleCancel(id){
    if(!confirm("Cancel this appointment?")) return;
    await cancelAppointment(id);
    setBanner("Appointment cancelled.");
    await loadRange();
  }

  async function handleReschedule(id, current){
    const newDate = prompt("New date (YYYY-MM-DD):", current.date);
    const newTime = prompt("New time (HH:MM):", current.start);
    if(!newDate || !newTime) return;
    await rescheduleAppointment(id, { date: newDate, time: newTime });
    setBanner("Appointment rescheduled.");
    await loadRange();
  }

  /** ---------- Availability actions ---------- */
  const toggleDay = (k) => setDays(d => ({ ...d, [k]: !d[k] }));
  async function handleSaveAvailability(e){
    e.preventDefault();
    setAvailBanner({ kind:"", text:"" });

    const chosen = Object.keys(days).filter(k=>days[k]);
    if(chosen.length===0) return setAvailBanner({ kind:"error", text:"Select at least one day." });
    if(startTime>=endTime) return setAvailBanner({ kind:"error", text:"Start time must be before end time." });

    const payload = { days:chosen, start:startTime, end:endTime, slotMinutes:Number(slotMinutes) };
    try{
      setSaving(true);
      await saveAvailability(payload);
      setAvailBanner({ kind:"success", text:"Availability saved." });
    } catch(err){
      setAvailBanner({ kind:"error", text:err?.message || "Failed to save availability" });
    } finally{ setSaving(false); }
  }

  return (
    <div className="bp-bg pd-bg">
      <div className="bp-decor-1" />
      <div className="bp-decor-2" />

      <main className="bp-shell pd-shell">
        <header className="pd-header">
          <h1>Provider Dashboard</h1>
          <p>Manage appointments and availability.</p>
        </header>

        {/* Tabs */}
        <div className="pd-tabs">
          <button className={`pd-tab ${tab==="appointments"?"pd-tab--active":""}`} onClick={()=>setTab("appointments")}>My Appointments</button>
          <button className={`pd-tab ${tab==="availability"?"pd-tab--active":""}`} onClick={()=>setTab("availability")}>Availability</button>
        </div>

        {tab==="appointments" ? (
          <div className="pd-grid">
            {/* Calendar */}
            <section className="bp-card pd-card pd-card--calendar">
              <Calendar year={cursor.getFullYear()} month={cursor.getMonth()} events={events} onSelectDate={setSelectedDay}/>
              {loading && <div className="pd-loading">Loading…</div>}
            </section>

            {/* Side panel */}
            <aside className="pd-side">
              {/* Selected day */}
              <section className="bp-card pd-card">
                <div className="pd-section-head">
                  <h2>Selected Day</h2>
                  <span className="pd-date">{selectedDay}</span>
                </div>

                {eventsForSelected.length===0 ? (
                  <div className="pd-empty">No appointments.</div>
                ) : (
                  <ul className="pd-list">
                    {eventsForSelected.map(e=>(
                      <li key={e.id} className="pd-item">
                        <div className="pd-time">{e.start}–{e.end}</div>
                        <div className="pd-title" title={e.title||"Appointment"}>{e.title||"Appointment"}</div>
                        <div className="pd-actions">
                          <span className={`pd-chip ${chipClass(e.status)}`}>{labelStatus(e.status)}</span>
                          <button className="pd-btn pd-btn--ghost" onClick={()=>handleReschedule(e.id,e)}>Reschedule</button>
                          <button className="pd-btn pd-btn--danger" onClick={()=>handleCancel(e.id)}>Cancel</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Upcoming */}
              <section className="bp-card pd-card">
                <div className="pd-section-head"><h2>Upcoming (next 8)</h2></div>
                {upcoming.length===0 ? (
                  <div className="pd-empty">Nothing scheduled.</div>
                ) : (
                  <ul className="pd-list">
                    {upcoming.map(e=>(
                      <li key={e.id} className="pd-item pd-item--compact">
                        <div className="pd-date">{e.date}</div>
                        <div className="pd-time">{e.start}–{e.end}</div>
                        <div className="pd-title">{e.title||"Appointment"}</div>
                        <div className="pd-actions">
                          <span className={`pd-chip ${chipClass(e.status)}`}>{labelStatus(e.status)}</span>
                          <button className="pd-btn pd-btn--ghost" onClick={()=>handleReschedule(e.id,e)}>Reschedule</button>
                          <button className="pd-btn pd-btn--danger" onClick={()=>handleCancel(e.id)}>Cancel</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        ) : (
          <section className="bp-card ap-card">
            {availBanner.text && (
              <div className={`bp-banner ${availBanner.kind==="error"?"bp-banner--err":"bp-banner--ok"}`}>{availBanner.text}</div>
            )}
            <form className="bp-form ap-form" onSubmit={handleSaveAvailability}>
              <div className="bp-field">
                <label className="bp-label">Working days</label>
                <div className="ap-days">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(k=>(
                    <label key={k} className={`ap-day ${days[k]?"ap-day--on":""}`}>
                      <input type="checkbox" checked={!!days[k]} onChange={()=>toggleDay(k)} />
                      <span>{k}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bp-row ap-row">
                <div>
                  <label className="bp-label">Start time</label>
                  <input type="time" className="bp-input" value={startTime} onChange={e=>setStartTime(e.target.value)} />
                </div>
                <div>
                  <label className="bp-label">End time</label>
                  <input type="time" className="bp-input" value={endTime} onChange={e=>setEndTime(e.target.value)} />
                </div>
                <div>
                  <label className="bp-label">Slot (minutes)</label>
                  <select className="bp-select" value={slotMinutes} onChange={e=>setSlotMinutes(e.target.value)}>
                    {[10,15,20,30,45,60].map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className={`bp-btn ${saving?"bp-btn--busy":""}`} disabled={saving}>
                {saving ? "Saving…" : "Save availability"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

/* ---------- Status helpers ---------- */
function chipClass(status=""){
  const s = String(status).toLowerCase();
  if(s.includes("cancel")) return "pd-chip--err";
  if(s.includes("complete")) return "pd-chip--ok";
  if(s.includes("pending")) return "pd-chip--warn";
  return "pd-chip--info";
}
function labelStatus(status="booked"){
  const s = String(status).toLowerCase();
  if(s.includes("cancel")) return "Cancelled";
  if(s.includes("complete")) return "Completed";
  if(s.includes("pending")) return "Pending";
  return "Booked";



  
}
