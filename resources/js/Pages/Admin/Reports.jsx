import React, { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import DataTable from '../../Components/DataTable';
import { FormField, SelectInput, TextInput } from '../../Components/FormControls';

export default function AdminReports() {
  const { rooms = [], utilization = [] } = usePage().props;
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [range, setRange] = useState({
    from: dayjs().startOf('week').format('YYYY-MM-DD'),
    to: dayjs().endOf('week').format('YYYY-MM-DD'),
  });

  const filtered = useMemo(
    () => utilization.filter((row) => !selectedRoomId || row.room_id === Number(selectedRoomId)),
    [utilization, selectedRoomId]
  );

  return (
    <AdminLayout title="Admin · Reports" heading="Utilization reports">
      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <FormField label="Room" htmlFor="report-room">
            <SelectInput
              id="report-room"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">All rooms</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="From" htmlFor="report-from">
            <TextInput
              id="report-from"
              type="date"
              value={range.from}
              onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))}
            />
          </FormField>
          <FormField label="To" htmlFor="report-to">
            <TextInput
              id="report-to"
              type="date"
              value={range.to}
              onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="mt-6">
          <DataTable
            columns={[
              { key: 'day', label: 'Day' },
              { key: 'room', label: 'Room' },
              { key: 'minutes', label: 'Minutes booked', className: 'w-40' },
            ]}
            emptyState="No utilization data in this range."
          >
            {filtered.map((row) => (
              <tr key={`${row.room_id}-${row.day}`}>
                <td className="px-3 py-2 text-sm text-slate-900">{dayjs(row.day).format('MMM D')}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{rooms.find((room) => room.id === row.room_id)?.name}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{row.booked_minutes}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </Card>
    </AdminLayout>
  );
}
