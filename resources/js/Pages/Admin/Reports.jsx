import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function AdminReports() {
  const { rooms = [], utilization = [] } = usePage().props;
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [range, setRange] = useState({
    from: dayjs().startOf('week').format('YYYY-MM-DD'),
    to: dayjs().endOf('week').format('YYYY-MM-DD'),
  });

  const filtered = utilization.filter((row) => !selectedRoomId || row.room_id === Number(selectedRoomId));

  return (
    <div className="min-h-screen bg-slate-100">
      <Head title="Admin · Reports" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Utilization reports</h1>
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="text-sm">
              <span className="text-slate-600">Room</span>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="mt-1 w-full rounded-md border-slate-300 text-sm"
              >
                <option value="">All rooms</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-slate-600">From</span>
              <input
                type="date"
                value={range.from}
                onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))}
                className="mt-1 w-full rounded-md border-slate-300 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="text-slate-600">To</span>
              <input
                type="date"
                value={range.to}
                onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))}
                className="mt-1 w-full rounded-md border-slate-300 text-sm"
              />
            </label>
          </div>
          <div className="mt-6">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Day</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Room</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Minutes booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={`${row.room_id}-${row.day}`}>
                    <td className="px-3 py-2 text-sm text-slate-900">{dayjs(row.day).format('MMM D')}</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{rooms.find((room) => room.id === row.room_id)?.name}</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{row.booked_minutes}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-sm text-slate-500">
                      No utilization data in this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
