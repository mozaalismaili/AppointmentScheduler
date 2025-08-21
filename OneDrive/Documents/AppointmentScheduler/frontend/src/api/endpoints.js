export const endpoints = {
  login: "/auth/login",
  getAvailability: "/availability",
  setAvailability: "/availability",
  book: "/appointments",
  myAppointments: "/appointments/me",
  cancel: (id) => `/appointments/${id}/cancel`,
};
