import { http, HttpResponse } from "msw";

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

    return HttpResponse.json([
      { date: "2025-08-16", startTime: "09:00", endTime: "09:30" },
      { date: "2025-08-16", startTime: "09:30", endTime: "10:00" },
      { date: "2025-08-16", startTime: "10:00", endTime: "10:30" },
    ]);
  }),

  // my appointments
  http.get("/api/appointments/me", () =>
      HttpResponse.json([

      ])
  ),

  // book appointment
  http.post("/api/appointments", async () =>
      HttpResponse.json({ ok: true, id: Math.floor(Math.random() * 1000) })
  ),

  // cancel appointment
  http.post("/api/appointments/:id/cancel", async () =>
      HttpResponse.json({ ok: true })
  ),
];
