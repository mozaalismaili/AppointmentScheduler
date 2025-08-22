export const endpoints = {
  login: "/auth/login",
  register: "/auth/register",
  availabilityByProvider: (providerId) => `/availability/provider/${providerId}`,
  createAvailability: "/availability",
  slots: "/slots",
  createAppointment: "/appointments",
  myAppointments: (customerId) => `/appointments/customer/${customerId}`,
  appointmentsByCustomer: (customerId) => `/appointments/customer/${customerId}`,
  cancel: (id) => `/appointments/${id}/cancel`,
};
