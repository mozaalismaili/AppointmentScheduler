import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomerAppointments, getProviderAppointments } from "../api/appointmentApi";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

// --- Customer & Provider hooks from feature branch ---
export const useCustomerAppointments = (customerId, options = {}) =>
  useQuery({
    queryKey: ['customerAppointments', customerId, options],
    queryFn: () => getCustomerAppointments(customerId, options),
    enabled: Boolean(customerId),
  });

export const useProviderAppointments = (providerId, options = {}) =>
  useQuery({
    queryKey: ['providerAppointments', providerId, options],
    queryFn: () => getProviderAppointments(providerId, options),
    enabled: Boolean(providerId),
  });

// --- My appointments & cancel hook from main branch ---
export function useMyAppointments() {
  return useQuery({
    queryKey: ["appointments", "me"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.myAppointments);
      return data;
    },
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(endpoints.cancel(id));
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}
