import { useMemo, useState } from "react";
import { useAvailability, useBookAppointment } from "../queries/availability";
import toast from "react-hot-toast";

export default function BookingPage() {
    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const [date, setDate] = useState(today);

    const { data: slots, isLoading, isError, refetch } = useAvailability(date);
    const book = useBookAppointment();

    const dateInvalid = date < today;

    const handleBook = (slot) => {
        if (dateInvalid) {
            toast.error("Date cannot be in the past");
            return;
        }
        book.mutate(
            { date, startTime: slot.startTime, endTime: slot.endTime, duration: 30 },
            {
                onSuccess: (res) => {
                    if (res?.ok) {
                        toast.success("Booked successfully");
                        refetch();
                    } else {
                        toast.error(res?.message ?? "Booking failed");
                    }
                },
                onError: (err) => {
                    const msg =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Booking failed";
                    toast.error(msg);
                },
            }
        );
    };

    return (
        <section>
            <h2>Book Appointment</h2>

            <label htmlFor="date">Date</label>
            <br />
            <input
                id="date"
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={dateInvalid}
            />
            {dateInvalid && (
                <p style={{ color: "#b91c1c", marginTop: 6 }}>
                    Please select today or a future date.
                </p>
            )}

            <p style={{ marginTop: 8 }}>Selected date: {date}</p>

            {isLoading && <p>Loading available slots…</p>}
            {isError && (
                <p style={{ color: "#b91c1c" }}>Failed to load availability.</p>
            )}
            {!isLoading && !isError && (!slots || slots.length === 0) && (
                <p>No available slots for this date.</p>
            )}

            <ul style={{ marginTop: 12 }}>
                {slots?.map((s, i) => (
                    <li key={i} style={{ marginBottom: 10 }}>
                        {s.startTime}–{s.endTime}{" "}
                        <button
                            onClick={() => handleBook(s)}
                            disabled={book.isPending || dateInvalid}
                            aria-busy={book.isPending}
                            title={dateInvalid ? "Pick a valid date" : "Book this slot"}
                        >
                            {book.isPending ? "Booking…" : "Book"}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
