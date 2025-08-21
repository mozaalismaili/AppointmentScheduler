import React, { useEffect, useMemo, useState } from "react";
import "./BookingPage.css";
import { getAvailability, createBooking } from "./api";

export default function BookingPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [service, setService] = useState("Consultation");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState([]);     // all available times
  const [booked, setBooked] = useState([]);   // times already taken
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState({ kind:"", text:"" });

  const todayKey = useMemo(()=> new Date().toISOString().slice(0,10), []);

  async function loadAvailability(dKey){
    setBanner({ kind:"", text:"" });
    try{
      const data = await getAvailability(dKey);
      // normalize multiple shapes:
      // { slots, booked } | { available, unavailable } | { times: [{time,available}] }
      if (Array.isArray(data?.times)) {
        setSlots(data.times.filter(t=>t.available !== false).map(t=>t.time));
        setBooked(data.times.filter(t=>t.available === false).map(t=>t.time));
      } else {
        setSlots(data.slots || data.available || []);
        setBooked(data.booked || data.unavailable || []);
      }
      setTime("");
    }catch{
      // fallback local slots 09:00-17:00
      const all = genSlots("09:00","17:00",30);
      setSlots(all);
      setBooked([]); // nothing booked in mock
      setBanner({ kind:"success", text:"Demo availability (backend not connected)" });
      setTime("");
    }
  }

  useEffect(()=>{ loadAvailability(date); }, [date]);

  const disabled = (t) => booked.includes(t) || (date === todayKey && t <= nowHHMM());
  const canSubmit = service && name && phone && date && time && !disabled(time);

  async function submit(e){
    e.preventDefault();
    if (!canSubmit) return;
    try{
      setBusy(true);
      await createBooking({ service, date, time, name, phone, notes });
      setBanner({ kind:"success", text:"✅ Booking created!" });
      setBooked(b => [...b, time]); // block chosen time locally
      setTime("");
      setNotes("");
    }catch(err){
      setBanner({ kind:"error", text: err.message || "Booking failed" });
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="bp-bg">
      <div className="bp-decor-1" />
      <div className="bp-decor-2" />

      <main className="bp-shell">
        <header className="bp-header">
          <h1>Book an Appointment</h1>
          <p>Select a date and time, then confirm your details.</p>
        </header>

        {banner.text && (
          <div className={`bp-banner ${banner.kind === "error" ? "bp-banner--err" : "bp-banner--ok"}`}>
            {banner.text}
          </div>
        )}

        <section className="bp-card">
          <form className="bp-form" onSubmit={submit} noValidate>
            <div className="bp-row">
              <div>
                <label className="bp-label" htmlFor="service">Service</label>
                <select id="service" className="bp-select" value={service} onChange={e=>setService(e.target.value)}>
                  <option>Consultation</option>
                  <option>Follow-up</option>
                  <option>Support</option>
                </select>
              </div>
              <div>
                <label className="bp-label" htmlFor="date">Date</label>
                <input id="date" className="bp-input" type="date" value={date} min={todayKey} onChange={e=>setDate(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="bp-label">Time</label>
              <div className="bp-times">
                {slots.length === 0 ? (
                  <div className="bp-empty">No slots for this date.</div>
                ) : (
                  slots.map(t => (
                    <button key={t} type="button"
                      className={`bp-chip ${time===t ? "bp-chip--active":""}`}
                      disabled={disabled(t)}
                      onClick={()=> setTime(t)}>
                      {t}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bp-row">
              <div>
                <label className="bp-label" htmlFor="name">Full name</label>
                <input id="name" className="bp-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="bp-label" htmlFor="phone">Phone</label>
                <input id="phone" className="bp-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+968 ..." />
              </div>
            </div>

            <div>
              <label className="bp-label" htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" className="bp-textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any extra details…" />
            </div>

            <button className={`bp-btn ${busy ? "bp-btn--busy":""}`} disabled={!canSubmit || busy} type="submit">
              <span className="bp-btn__spinner" aria-hidden />
              {busy ? "Booking…" : "Confirm booking"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

/* helpers */
function genSlots(start="09:00", end="17:00", step=30){
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const from = sh*60+sm, to = eh*60+em;
  const out = [];
  for(let m=from; m<to; m+=step){
    const h = String(Math.floor(m/60)).padStart(2,"0");
    const mm = String(m%60).padStart(2,"0");
    out.push(`${h}:${mm}`);
  }
  return out;
}
function nowHHMM(){
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
