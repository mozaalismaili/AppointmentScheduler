// src/api.js
function toISODate(d){ return typeof d === "string" ? d : d.toISOString().slice(0,10); }

export function getBase() {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    if (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL)   return process.env.REACT_APP_API_BASE_URL;
  } catch {}
  return "/api";
}

/* ---------- Provider calendar ---------- */
export async function fetchAppointments(rangeStart, rangeEnd){
  const base = getBase();
  const from = toISODate(rangeStart), to = toISODate(rangeEnd);
  try{
    const res = await fetch(`${base}/appointments?from=${from}&to=${to}`, { credentials:"include" });
    if(!res.ok) throw new Error();
    const data = await res.json();
    return data.map(a => ({
      id: a.id,
      title: a.customerName || a.title || "Appointment",
      date: a.date,                       // YYYY-MM-DD
      start: a.start_time || a.start,     // HH:mm
      end:   a.end_time   || a.end,       // HH:mm
      status: a.status || "booked",
      notes: a.notes || ""
    }));
  }catch{
    // Fallback so UI works without backend
    const today = new Date();
    const pad = n => String(n).padStart(2,"0");
    const d = off => { const t=new Date(today); t.setDate(t.getDate()+off); return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`; };
    return [
      { id:"E-1", title:"John Smith",  date:d(0), start:"09:00", end:"09:30", status:"booked" },
      { id:"E-2", title:"Aisha Noor",  date:d(1), start:"11:30", end:"12:00", status:"booked" },
      { id:"E-3", title:"Follow-up",   date:d(2), start:"15:00", end:"15:30", status:"booked" },
    ];
  }
}

/* ---------- Customer dashboard ---------- */
export async function fetchMyAppointments(){
  const base = getBase();
  const r = await fetch(`${base}/my/appointments`, { credentials:"include" });
  if(!r.ok) throw new Error("Failed to load appointments");
  return r.json();
}
export async function cancelAppointment(id){
  const base = getBase();
  const r = await fetch(`${base}/appointments/${id}/cancel`, { method:"POST", credentials:"include" });
  if(!r.ok) throw new Error("Cancel failed");
  return r.json();
}
export async function rescheduleAppointment(id, { date, time }){
  const base = getBase();
  const r = await fetch(`${base}/appointments/${id}/reschedule`, {
    method:"POST", credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ date, time })
  });
  if(!r.ok) throw new Error("Reschedule failed");
  return r.json();
}

/* ---------- Booking page ---------- */
export async function getAvailability(date){
  const base = getBase();
  const r = await fetch(`${base}/availability?date=${toISODate(date)}`, { credentials:"include" });
  if(!r.ok) throw new Error("Failed to load availability");
  return r.json(); // component normalizes any shape
}
export async function createBooking(payload){
  const base = getBase();
  const r = await fetch(`${base}/bookings`, {
    method:"POST", credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  if(!r.ok) throw new Error("Booking failed");
  return r.json();
}

/* ---------- Provider availability setup ---------- */
export async function saveAvailability(payload){
  const base = getBase();
  const r = await fetch(`${base}/availability`, {
    method:"POST", credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  if(!r.ok) throw new Error("Saving availability failed");
  return r.json();
}
