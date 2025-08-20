import React, { useState } from 'react';
import { useCustomerAppointments } from '../queries/appointmentQueries';
import AppointmentList from '../components/AppointmentList';

export default function CustomerAppointmentsPage({ customerId }) {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });

  const { data, isLoading, error } = useCustomerAppointments(customerId, {
    ...filters,
    page,
    size: 10,
    sort: 'appointmentTime,asc'
  });

  const onChange = e => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">My Appointments</h1>

      <div className="flex gap-2 items-end flex-wrap">
        <div className="flex flex-col">
          <label className="text-xs">Status</label>
          <select name="status" value={filters.status} onChange={onChange} className="border rounded p-2">
            <option value="">Any</option>
            <option value="BOOKED">BOOKED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs">From (ISO)</label>
          <input name="from" type="datetime-local" value={filters.from} onChange={onChange} className="border rounded p-2" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs">To (ISO)</label>
          <input name="to" type="datetime-local" value={filters.to} onChange={onChange} className="border rounded p-2" />
        </div>
        <button className="px-3 py-2 border rounded" onClick={() => setPage(0)}>Apply</button>
      </div>

      {isLoading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error.message}</div>}
      {!isLoading && !error && (
        <AppointmentList pageData={data} onPageChange={setPage} />
      )}
    </div>
  );
}
