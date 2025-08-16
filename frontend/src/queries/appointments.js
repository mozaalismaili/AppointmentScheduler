import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { endpoints } from '../api/endpoints';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

export function useMyAppointments() {
  return useQuery({
    queryKey: ["appointments", "me"],
    queryFn: async () => (await api.get(endpoints.myAppointments)).data,
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.post(endpoints.cancel(id))).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", "me"] }),
  });
}
