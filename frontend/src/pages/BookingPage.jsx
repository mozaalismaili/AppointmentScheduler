import { useState } from "react";
import { useAvailability } from "../queries/availability";
import { useBookAppointment } from "../queries/availability";

export default function BookingPage() {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const { data: slots, isLoading, isError } = useAvailability(date);
    const book = useBookAppointment();

    return (
        <section>
            <h2>Book Appointment</h2>

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <p>Selected date: {date}</p>

            {isLoading && <p>Loading slots…</p>}
            {isError && <p>Failed to load slots</p>}

            <ul>
                {slots?.map((s, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                        {s.startTime}–{s.endTime}{" "}
                        <button
                            disabled={book.isPending}
                            onClick={() => book.mutate({ date, startTime: s.startTime, duration: 30 })}
                        >
                            Book
                        </button>
                    </li>
                ))}
            </ul>

            {book.isSuccess && <p>Booked successfully!</p>}
            {book.isError && <p>Booking failed</p>}
        </section>
    );
}
