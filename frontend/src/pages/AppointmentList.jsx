import { useMyAppointments, useCancelAppointment } from "../queries/appointments";

export default function AppointmentList() {
    const { data, isLoading, isError } = useMyAppointments();
    const cancelMut = useCancelAppointment();

    return (
        <section>
            <h2>My Appointments</h2>
            {isLoading && <p>Loading…</p>}
            {isError && <p>Failed to load</p>}
            <ul>
                {(data ?? []).length === 0 && <li>No appointments yet</li>}
                {data?.map((a) => (
                    <li key={a.id} style={{ marginBottom: 6 }}>
                        {a.date} {a.startTime}–{a.endTime} ({a.status ?? "booked"})
                        <button
                            style={{ marginLeft: 8 }}
                            onClick={() => cancelMut.mutate(a.id)}
                            disabled={cancelMut.isPending}
                        >
                            Cancel
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
