const BASE = "/api/appointments";

const buildQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

export async function getCustomerAppointments(customerId, { status, from, to, page = 0, size = 10, sort = "appointmentTime,asc" } = {}) {
  const res = await fetch(`${BASE}/customer/${customerId}${buildQuery({ status, from, to, page, size, sort })}`);
  if (!res.ok) throw new Error("Failed to load customer appointments");
  return res.json(); // Spring Data Page<AppointmentDTO>
}

export async function getProviderAppointments(providerId, { status, from, to, page = 0, size = 10, sort = "appointmentTime,asc" } = {}) {
  const res = await fetch(`${BASE}/provider/${providerId}${buildQuery({ status, from, to, page, size, sort })}`);
  if (!res.ok) throw new Error("Failed to load provider appointments");
  return res.json();
}
