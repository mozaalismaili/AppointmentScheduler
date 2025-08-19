import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

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
