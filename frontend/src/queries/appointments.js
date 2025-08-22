import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { useSelector } from "react-redux";

// Helper function to convert numeric userId to UUID format
function convertUserIdToUuid(userId) {
  if (!userId) return null;
  return `00000000-0000-0000-0000-${String(userId).padStart(12, '0')}`;
}

export function useMyAppointments() {
  const { userId, role } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["appointments", "me", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User not logged in or userId not available.");
      }
      
      // Convert numeric userId to UUID format
      const customerUuid = convertUserIdToUuid(userId);
      if (!customerUuid) {
        throw new Error("Invalid user ID format.");
      }
      
      const { data } = await api.get(endpoints.myAppointments(customerUuid));
      return data;
    },
    enabled: !!userId && role === 'customer',
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(endpoints.cancel(id));
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}
