import { useMyAppointments, useCancelAppointment } from "../queries/appointments";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";

export default function AppointmentList() {
  const { data, isLoading, isError } = useMyAppointments();
  const cancelMut = useCancelAppointment();
  const [filter, setFilter] = useState("all"); // all, active, canceled

  const filteredAppointments = useMemo(() => {
    if (!data) return [];
    let arr = [...data];
    arr.sort((a, b) => new Date(a.date + "T" + a.startTime) - new Date(b.date + "T" + b.startTime));
    if (filter === "active") return arr.filter(a => a.status !== "canceled");
    if (filter === "canceled") return arr.filter(a => a.status === "canceled");
    return arr;
  }, [data, filter]);

  const onCancel = (id) => {
    const appointment = data.find(a => a.id === id);
    if (!appointment || appointment.status === "canceled") return;
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    cancelMut.mutate(id, {
      onSuccess: () => toast.success("Appointment canceled"),
      onError: () => toast.error("Cancel failed"),
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "canceled": return "#9ca3af"; // gray
      case "completed": return "#16a34a"; // green
      case "booked":
      default: return "#2563eb"; // blue
    }
  };

  return (
    <section style={{ marginTop: 24 }}>
      <h2>My Appointments</h2>

      {/* Filter */}
      <div style={{ marginBottom: 12 }}>
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {isLoading && <p>Loading appointments…</p>}
      {isError && <p style={{ color: "#b91c1c" }}>Failed to load your appointments.</p>}
      {!isLoading && !isError && filteredAppointments.length === 0 && <p>No appointments found.</p>}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {filteredAppointments.map((a) => (
          <li key={a.id} style={{
            marginBottom: 8,
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: a.status === "canceled" ? "#f3f4f6" : "#ffffff"
          }}>
            <div>
              <span style={{ color: getStatusColor(a.status), fontWeight: 600 }}>
                {a.status.toUpperCase()}
              </span>{" "}
              — {a.date} {a.startTime}–{a.endTime}
            </div>

            <button
              style={{
                marginLeft: 8,
                padding: "4px 8px",
                cursor: a.status === "canceled" || cancelMut.isPending ? "not-allowed" : "pointer"
              }}
              onClick={() => onCancel(a.id)}
              disabled={cancelMut.isPending || a.status === "canceled"}
              aria-busy={cancelMut.isPending}
            >
              {a.status === "canceled"
                ? "Canceled"
                : cancelMut.isPending
                  ? "Canceling…"
                  : "Cancel"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
