import { useMyAppointments, useCancelAppointment } from "../queries/appointments";
import toast from "react-hot-toast";

export default function AppointmentList() {
    const { data, isLoading, isError } = useMyAppointments();
    const cancelMut = useCancelAppointment();

    const onCancel = (id) => {
        if (!window.confirm("Cancel this appointment?")) return;
        cancelMut.mutate(id, {
            onSuccess: () => toast.success("Appointment canceled"),
            onError: () => toast.error("Cancel failed"),
        });
    };

    return (
        <section style={{ marginTop: 24 }}>
            <h2>My Appointments</h2>

            {isLoading && <p>Loading…</p>}
            {isError && (
                <p style={{ color: "#b91c1c" }}>Failed to load your appointments.</p>
            )}
            {!isLoading && !isError && (!data || data.length === 0) && (
                <p>No appointments yet.</p>
            )}

            <ul>
                {data?.map((a) => (
                    <li key={a.id} style={{ marginBottom: 8 }}>
                        {a.date} {a.startTime}–{a.endTime} — <strong>{a.status}</strong>
                        <button
                            style={{ marginLeft: 8 }}
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
