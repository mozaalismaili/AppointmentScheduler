import React, { useEffect, useMemo, useState } from "react";
import "./CustomerDashboard.css";


export default function CustomerDashboard({ apiBaseUrl }) {
  const resolvedApi = useMemo(() => getApiBaseUrl(apiBaseUrl), [apiBaseUrl]);

  // UI state
  const [tab, setTab] = useState("upcoming"); // "upcoming" | "past"
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ kind: "success", text: "" });

  // Data
  const [all, setAll] = useState([]);

  // Load appointments
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        // Try real backend
        const r = await fetch(`${resolvedApi}/my/appointments`);
        if (!r.ok) throw new Error();
        const data = await r.json();
        setAll(normalizeAppointments(data));
      } catch {
        // Fallback (mock data)
        const mock = mockAppointments();
        setAll(mock);
        setBanner({
          kind: "success",
          text: "", 
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedApi]);

  // Derived lists
  const now = Date.now();
  const filtered = useMemo(() => {
    let items = [...all];

    // search by service or provider
    if (q.trim()) {
      const s = q.toLowerCase();
      items = items.filter(
        (x) =>
          x.service.toLowerCase().includes(s) ||
          (x.provider || "").toLowerCase().includes(s)
      );
    }

    // date range
    if (from) items = items.filter((x) => toTime(x.date, x.time) >= new Date(from).getTime());
    if (to) items = items.filter((x) => toTime(x.date, x.time) <= endOfDayMs(new Date(to)));

    // upcoming vs past
    const [up, past] = splitUpcomingPast(items, now);
    return tab === "upcoming" ? up : past;
  }, [all, q, from, to, tab, now]);

  return (
    <div className="cd-bg">
      <div className="cd-decor-1" />
      <div className="cd-decor-2" />

      <main className="cd-shell" aria-live="polite">
        <header className="cd-header">
          <h1>Your Appointments</h1>
          <p>See your upcoming visits and review your past history in one place.</p>
        </header>

        {banner.text && (
          <div className={`cd-banner ${banner.kind === "error" ? "cd-banner--error" : ""}`}>
            {banner.text}
          </div>
        )}

        <section className="cd-card">
          {/* Controls */}
          <div className="cd-controls" role="search">
            <div>
              <label className="cd-label" htmlFor="q">Search</label>
              <input
                id="q"
                className="cd-input"
                placeholder="Search by service or provider…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div>
              <label className="cd-label" htmlFor="from">From</label>
              <input id="from" className="cd-input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="cd-label" htmlFor="to">To</label>
              <input id="to" className="cd-input" type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div>
              <button className="cd-btn cd-btn--ghost" onClick={() => { setQ(""); setFrom(""); setTo(""); }}>
                Reset
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="cd-tabs" role="tablist" aria-label="Appointment type">
            <button className="cd-tab" role="tab" aria-selected={tab === "upcoming"} onClick={() => setTab("upcoming")}>
              Upcoming
            </button>
            <button className="cd-tab" role="tab" aria-selected={tab === "past"} onClick={() => setTab("past")}>
              Past
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <DashboardSkeleton />
          ) : filtered.length === 0 ? (
            <div className="cd-empty">
              <p>No <strong>{tab}</strong> appointments found.</p>
              <p className="cd-empty__hint">Try changing the date range or clearing the search.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="cd-table-wrap" aria-hidden={false}>
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th className="cd-th">Date</th>
                      <th className="cd-th">Time</th>
                      <th className="cd-th">Service</th>
                      <th className="cd-th">Provider</th>
                      <th className="cd-th">Status</th>
                      <th className="cd-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id}>
                        <td className="cd-td">{fmtDate(a.date)}</td>
                        <td className="cd-td">{a.time}</td>
                        <td className="cd-td">{a.service}</td>
                        <td className="cd-td">{a.provider || "—"}</td>
                        <td className="cd-td">{statusChip(a.status)}</td>
                        <td className="cd-td">
                          <div className="cd-actions">
                            <button className="cd-btn cd-btn--ghost" onClick={() => alert(`Viewing #${a.id}`)}>View</button>
                            <button className="cd-btn" disabled={!canReschedule(a)} onClick={() => alert(`Reschedule #${a.id}`)}>Reschedule</button>
                            <button className="cd-btn cd-btn--ghost" disabled={!canCancel(a)} onClick={() => alert(`Cancel #${a.id}`)}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="cd-list">
                {filtered.map((a) => (
                  <article key={a.id} className="cd-item" aria-label={`${a.service} on ${fmtDate(a.date)} at ${a.time}`}>
                    <div className="cd-item__row">
                      <div className="cd-item__title">{a.service}</div>
                      <div>{statusChip(a.status)}</div>
                    </div>
                    <div className="cd-item__row">
                      <div>📅 {fmtDate(a.date)}</div>
                      <div>⏰ {a.time}</div>
                    </div>
                    <div className="cd-item__row">
                      <div>👤 {a.provider || "—"}</div>
                      <div className="cd-actions">
                        <button className="cd-btn cd-btn--ghost" onClick={() => alert(`View #${a.id}`)}>View</button>
                        <button className="cd-btn" disabled={!canReschedule(a)} onClick={() => alert(`Reschedule #${a.id}`)}>Reschedule</button>
                        <button className="cd-btn cd-btn--ghost" disabled={!canCancel(a)} onClick={() => alert(`Cancel #${a.id}`)}>Cancel</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------------- helpers ---------------- */

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

function normalizeAppointments(arr) {
  // Accept a variety of shapes, return normalized
  if (!Array.isArray(arr)) return [];
  return arr.map((x, i) => ({
    id: x.id ?? String(i + 1),
    service: x.service ?? x.title ?? "Service",
    provider: x.provider ?? x.staff ?? x.doctor ?? "",
    date: x.date ?? (x.datetime ? x.datetime.slice(0, 10) : ""),
    time: x.time ?? (x.datetime ? x.datetime.slice(11, 16) : ""),
    status: (x.status || "confirmed").toLowerCase(),
  })).filter(x => x.date && x.time);
}

function mockAppointments() {
  // Some demo data around "today"
  const today = new Date();
  const d = (offset) => {
    const t = new Date(today);
    t.setDate(t.getDate() + offset);
    return t.toISOString().slice(0,10);
  };
  return normalizeAppointments([
    { id: "A-1001", service: "Consultation", provider: "Dr. Ahmed", date: d(1), time: "09:00", status: "confirmed" },
    { id: "A-1002", service: "Follow-up",   provider: "Dr. Sara",  date: d(3), time: "11:30", status: "pending" },
    { id: "A-1003", service: "Support",     provider: "Team A",    date: d(-2), time: "15:00", status: "completed" },
    { id: "A-1004", service: "Consultation", provider: "Dr. Ali",  date: d(-10), time: "10:30", status: "cancelled" },
  ]);
}

function toTime(dateStr, timeStr){
  const [h, m] = String(timeStr).split(":").map(Number);
  return new Date(`${dateStr}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`).getTime();
}
function endOfDayMs(d){ const x = new Date(d); x.setHours(23,59,59,999); return x.getTime(); }
function splitUpcomingPast(items, nowMs){
  const up = [], past = [];
  items.forEach(x => (toTime(x.date, x.time) >= nowMs ? up : past).push(x));
  // Sort: upcoming asc, past desc
  up.sort((a,b)=>toTime(a.date,a.time)-toTime(b.date,b.time));
  past.sort((a,b)=>toTime(b.date,b.time)-toTime(a.date,a.time));
  return [up, past];
}

function fmtDate(dateStr){
  try{
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday:"short", year:"numeric", month:"short", day:"numeric" });
  }catch{ return dateStr }
}

function statusChip(status){
  const s = String(status || "").toLowerCase();
  let cls = "cd-chip", label = "Confirmed";
  if (s === "completed") { cls += " cd-chip--ok"; label = "Completed"; }
  else if (s === "pending") { cls += " cd-chip"; label = "Pending"; }
  else if (s === "cancelled" || s === "canceled") { cls += " cd-chip--err"; label = "Cancelled"; }
  else { cls += " cd-chip"; label = s ? capitalize(s) : "Confirmed"; }
  return <span className={cls} aria-label={`status: ${label}`}>{label}</span>;
}
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

function canCancel(a){
  const t = toTime(a.date, a.time);
  return t > Date.now() && !/cancel/i.test(a.status) && !/completed/i.test(a.status);
}
function canReschedule(a){
  const t = toTime(a.date, a.time);
  return t > Date.now() && !/completed/i.test(a.status);
}

/* Small skeleton while loading */
function DashboardSkeleton(){
  return (
    <div aria-hidden="true">
      <div className="cd-skel" style={{height:18, marginBottom:10, width:"45%"}}/>
      {[...Array(5)].map((_,i)=>(
        <div key={i} style={{display:"grid", gridTemplateColumns:"1.2fr .6fr 1fr 1fr .8fr 1fr", gap:10, alignItems:"center", margin:"10px 0"}}>
          <div className="cd-skel" />
          <div className="cd-skel" />
          <div className="cd-skel" />
          <div className="cd-skel" />
          <div className="cd-skel" />
          <div className="cd-skel" />
        </div>
      ))}
    </div>
  );
}
