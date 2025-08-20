import React from 'react';

export default function AppointmentList({ pageData, onPageChange }) {
  if (!pageData) return null;
  const { content = [], totalElements = 0, number = 0, totalPages = 0 } = pageData;

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Total: {totalElements}</div>
      <ul className="divide-y rounded-lg border">
        {content.map(a => (
          <li key={a.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">#{a.id} • {a.status}</div>
              <div className="text-sm">
                {new Date(a.appointmentTime).toLocaleString()}
                {" • "}Customer: {a.customerId} • Provider: {a.providerId}
              </div>
              {a.notes && <div className="text-xs text-gray-500 mt-1">{a.notes}</div>}
            </div>
          </li>
        ))}
        {content.length === 0 && <li className="p-4 text-sm text-gray-500">No appointments.</li>}
      </ul>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded border"
          onClick={() => onPageChange(Math.max(number - 1, 0))}
          disabled={number === 0}
        >Prev</button>
        <span className="text-sm self-center">Page {number + 1} / {Math.max(totalPages, 1)}</span>
        <button
          className="px-3 py-1 rounded border"
          onClick={() => onPageChange(Math.min(number + 1, totalPages - 1))}
          disabled={number + 1 >= totalPages}
        >Next</button>
      </div>
    </div>
  );
}
