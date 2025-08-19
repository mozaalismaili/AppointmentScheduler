import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

export const availabilityKey = (date) => ["availability", date];

export function useAvailability(date) {
  return useQuery({
    queryKey: availabilityKey(date),
    queryFn: async () => {
      const { data } = await api.get(endpoints.getAvailability, { params: { date } });
      return data;
    },
    staleTime: 60_000,
  });
}

export function useBookAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(endpoints.book, payload);
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
