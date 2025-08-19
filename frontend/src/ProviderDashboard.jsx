import { useEffect, useMemo, useState } from "react";
import Calendar from "./components/Calendar";
import { fetchAppointments } from "./api";
import "./ProviderDashboard.css";

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function fmt(d) { return d.toISOString().slice(0,10); }

export default function ProviderDashboard() {
  const [cursor, setCursor] = useState(startOfMonth(new Date()));
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => fmt(new Date()));

  const ym = useMemo(() => ({ y: cursor.getFullYear(), m: cursor.getMonth() }), [cursor]);

  useEffect(() => {
    const from = startOfMonth(cursor);
    const to   = endOfMonth(cursor);
    setLoading(true);
    fetchAppointments(from, to)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [cursor]);

  const eventsForSelected = useMemo(
    () => events.filter(e => e.date === selectedDay)
                .sort((a,b) => a.start.localeCompare(b.start)),
    [events, selectedDay]
  );

  const upcoming = useMemo(() => {
    const today = new Date();
    const todayKey = fmt(today);
    return events
      .filter(e => e.date >= todayKey)
      .sort((a,b) => (a.date + a.start).localeCompare(b.date + b.start))
      .slice(0, 8);
  }, [events]);

  return (
    <div className="pd">
      <div className="pd__header">
        <h1>Provider Dashboard</h1>
        <p className="pd__sub">View and manage your appointments.</p>
      </div>

      <div className="pd__content">
        <div className="pd__left">
          <Calendar
            year={ym.y}
            month={ym.m}
            events={events}
            onPrev={() => setCursor(c => addMonths(c, -1))}
            onNext={() => setCursor(c => addMonths(c, 1))}
            onToday={() => setCursor(startOfMonth(new Date()))}
            onSelectDate={setSelectedDay}
          />
          {loading && <div className="pd__loading">Loading…</div>}
        </div>

        <div className="pd__right">
          <section className="pd__panel">
            <h2>Selected Day</h2>
            <div className="pd__date">{selectedDay}</div>
            {eventsForSelected.length === 0 ? (
              <div className="pd__empty">No appointments.</div>
            ) : (
              <ul className="pd__list">
                {eventsForSelected.map(e => (
                  <li key={e.id} className="pd__row">
                    <div className="pd__time">{e.start}-{e.end}</div>
                    <div className="pd__title">{e.title}</div>
                    <div className={`pd__status pd__status--${e.status}`}>{e.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="pd__panel">
            <h2>Upcoming (next 8)</h2>
            {upcoming.length === 0 ? (
              <div className="pd__empty">Nothing scheduled.</div>
            ) : (
              <ul className="pd__list">
                {upcoming.map(e => (
                  <li key={e.id} className="pd__row">
                    <div className="pd__date">{e.date}</div>
                    <div className="pd__time">{e.start}-{e.end}</div>
                    <div className="pd__title">{e.title}</div>
                    <div className={`pd__status pd__status--${e.status}`}>{e.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
