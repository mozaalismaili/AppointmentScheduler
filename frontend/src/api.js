// Minimal API client with a mock fallback.
// Backend contract expected at: GET /api/appointments?from=YYYY-MM-DD&to=YYYY-MM-DD
// Response shape (example):
// [{ id, customerName, date: '2025-08-19', start_time: '09:00', end_time: '09:30', status, notes }]

function toISODate(d) {
    return d.toISOString().slice(0, 10);
  }
  
  export async function fetchAppointments(rangeStart, rangeEnd) {
    const from = typeof rangeStart === "string" ? rangeStart : toISODate(rangeStart);
    const to = typeof rangeEnd === "string" ? rangeEnd : toISODate(rangeEnd);
    try {
      const res = await fetch(`/api/appointments?from=${from}&to=${to}`, { credentials: "include" });
      if (!res.ok) throw new Error("Bad status");
      const data = await res.json();
      return data.map(a => ({
        id: a.id,
        title: a.customerName || "Appointment",
        date: a.date,             // YYYY-MM-DD
        start: a.start_time,      // HH:mm
        end: a.end_time,          // HH:mm
        status: a.status || "booked",
        notes: a.notes || ""
      }));
    } catch {
      // Mock data so the page works before backend is ready.
      const today = new Date();
      const pad = n => String(n).padStart(2, "0");
      const d = (offset) => {
        const t = new Date(today);
        t.setDate(t.getDate() + offset);
        return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`;
      };
      return [
        { id: 1, title: "John Smith", date: d(0),  start: "09:00", end: "09:30", status: "booked" },
        { id: 2, title: "Aisha Noor",  date: d(1),  start: "13:00", end: "13:30", status: "booked" },
        { id: 3, title: "M. Chen",     date: d(2),  start: "10:00", end: "10:30", status: "booked" },
        { id: 4, title: "Follow-up",   date: d(2),  start: "15:00", end: "15:30", status: "booked" },
        { id: 5, title: "Walk-in",     date: d(7),  start: "11:00", end: "11:30", status: "booked" }
      ];
    }
  }
  