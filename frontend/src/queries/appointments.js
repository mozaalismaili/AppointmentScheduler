import { useQuery } from '@tanstack/react-query';
import { getCustomerAppointments, getProviderAppointments } from '../api/appointmentApi';

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
