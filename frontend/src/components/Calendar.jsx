import { useMemo } from "react";
import "./Calendar.css";

/**
 * props:
 *  - year, month (0-based month)
 *  - events: [{ id, title, date:'YYYY-MM-DD', start:'HH:mm', end:'HH:mm', status }]
 *  - onPrev(), onNext(), onToday()
 *  - onSelectDate(yyyy_mm_dd)
 */
export default function Calendar({
  year, month, events = [],
  onPrev, onNext, onToday, onSelectDate
}) {
  const { weeks, label, eventsByDay, todayKey } = useMemo(() => {
    const monthStart = new Date(year, month, 1);
    const monthEnd   = new Date(year, month + 1, 0);
    const start = new Date(monthStart);
    start.setDate(start.getDate() - ((start.getDay() + 7) % 7)); // start on Sunday

    const end = new Date(monthEnd);
    end.setDate(end.getDate() + (6 - ((end.getDay() + 7) % 7))); // end on Saturday

    // Map events by YYYY-MM-DD
    const map = new Map();
    for (const ev of events) {
      const key = ev.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }

    const weeks = [];
    let cursor = new Date(start);
    while (cursor <= end) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, "0");
        const d = String(cursor.getDate()).padStart(2, "0");
        const key = `${y}-${m}-${d}`;
        week.push({
          key,
          inMonth: cursor.getMonth() === month,
          dateNum: cursor.getDate(),
          events: (map.get(key) || []).slice(0, 3) // show up to 3 badges
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const label = monthStart.toLocaleString(undefined, { month: "long", year: "numeric" });
    const t = new Date();
    const tk = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;

    return { weeks, label, eventsByDay: map, todayKey: tk };
  }, [year, month, events]);

  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="cal">
      <div className="cal__toolbar">
        <div className="cal__left">
          <button onClick={onPrev} className="cal__btn">‹</button>
          <button onClick={onToday} className="cal__btn">Today</button>
          <button onClick={onNext} className="cal__btn">›</button>
        </div>
        <div className="cal__label">{label}</div>
        <div className="cal__right" />
      </div>

      <div className="cal__grid">
        {weekdays.map(w => <div key={w} className="cal__dow">{w}</div>)}

        {weeks.map((week, wi) =>
          week.map((cell, ci) => (
            <button
              key={cell.key}
              className={
                "cal__cell" +
                (cell.inMonth ? "" : " cal__cell--muted") +
                (cell.key === todayKey ? " cal__cell--today" : "")
              }
              onClick={() => onSelectDate?.(cell.key)}
              title={cell.key}
            >
              <div className="cal__date">{cell.dateNum}</div>
              <div className="cal__events">
                {cell.events.map(e => (
                  <div key={e.id} className="cal__pill" title={`${e.title} ${e.start}-${e.end}`}>
                    <span className="cal__pill-dot" />
                    <span className="cal__pill-text">{e.start} {e.title}</span>
                  </div>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
