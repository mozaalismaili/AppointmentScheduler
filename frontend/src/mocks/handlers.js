import { http, HttpResponse } from "msw";

let bookings = [];

export const handlers = [
    // login
    http.post("/api/auth/login", async () =>
        HttpResponse.json({
            token: "fake-token-123",
            role: "customer",
            name: "Az",
            email: "az@example.com",
        })
    ),

    // availability for selected date
    http.get("/api/availability", ({ request }) => {
        const url = new URL(request.url);
        const date = url.searchParams.get("date") ?? "2025-08-16";
        const slots = [
            { date, startTime: "09:00", endTime: "09:30" },
            { date, startTime: "09:30", endTime: "10:00" },
            { date, startTime: "10:00", endTime: "10:30" },
        ];
        return HttpResponse.json(slots);
    }),

    // get my appointments
    http.get("/api/appointments/me", () => HttpResponse.json(bookings)),

    // book appointment
    http.post("/api/appointments", async ({ request }) => {
        const body = await request.json();
        const exists = bookings.some(
            (b) => b.date === body.date && b.startTime === body.startTime
        );
        if (exists) {
            return HttpResponse.json(
                { ok: false, message: "Slot already booked" },
                { status: 409 }
            );
        }
        const id = Math.floor(Math.random() * 100000);
        bookings.push({
            id,
            date: body.date,
            startTime: body.startTime,
            endTime: body.endTime ?? "09:30",
            status: "booked",
        });
        return HttpResponse.json({ ok: true, id });
    }),

    // cancel appointment
    http.post("/api/appointments/:id/cancel", async ({ params }) => {
        const id = Number(params.id);
        bookings = bookings.map((b) =>
            b.id === id ? { ...b, status: "canceled" } : b
        );
        return HttpResponse.json({ ok: true });
    }),
];
