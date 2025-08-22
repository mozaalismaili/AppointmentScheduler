import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

export const availabilityKey = (date) => ["availability", date];

export function useAvailability(providerId, date) {
  return useQuery({
    queryKey: availabilityKey(`${providerId}-${date}`),
    queryFn: async () => {
      // Prefer slots endpoint if date is given
      if (date) {
        const { data } = await api.get(endpoints.slots, { params: { providerId, date } });
        // Backend returns just a list of LocalTime strings
        return data || [];
      }
      const { data } = await api.get(endpoints.availabilityByProvider(providerId), { params: { activeOnly: true } });
      return data;
    },
    enabled: !!providerId,
    staleTime: 60_000,
  });
}

export function useBookAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(endpoints.createAppointment, payload);
      return data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["appointments", "me"] });
      if (vars?.date) {
        qc.invalidateQueries({ queryKey: availabilityKey(vars.date) });
      }
    },
  });
}
