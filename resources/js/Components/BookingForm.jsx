import React from 'react';
import { useForm } from '@inertiajs/react';

export default function BookingForm({ rooms }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    room_id: rooms[0]?.id || '',
    starts_at: '',
    ends_at: '',
    attendee_count: 1,
    title: '',
    notes: '',
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        post('/api/v1/bookings', {
          onSuccess: () => reset('starts_at', 'ends_at', 'title', 'notes'),
        });
      }}
      className="mt-4 space-y-4"
    >
      <label className="block text-sm">
        <span className="text-slate-600">Room</span>
        <select
          value={data.room_id}
          onChange={(e) => setData('room_id', e.target.value)}
          className="mt-1 w-full rounded-md border-slate-300 text-sm"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        {errors.room_id && <p className="mt-1 text-xs text-rose-600">{errors.room_id}</p>}
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Start time</span>
        <input
          type="datetime-local"
          value={data.starts_at}
          onChange={(e) => setData('starts_at', e.target.value)}
          className="mt-1 w-full rounded-md border-slate-300 text-sm"
        />
        {errors.starts_at && <p className="mt-1 text-xs text-rose-600">{errors.starts_at}</p>}
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">End time</span>
        <input
          type="datetime-local"
          value={data.ends_at}
          onChange={(e) => setData('ends_at', e.target.value)}
          className="mt-1 w-full rounded-md border-slate-300 text-sm"
        />
        {errors.ends_at && <p className="mt-1 text-xs text-rose-600">{errors.ends_at}</p>}
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Attendees</span>
        <input
          type="number"
          min="1"
          value={data.attendee_count}
          onChange={(e) => setData('attendee_count', e.target.value)}
          className="mt-1 w-full rounded-md border-slate-300 text-sm"
        />
        {errors.attendee_count && <p className="mt-1 text-xs text-rose-600">{errors.attendee_count}</p>}
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Title</span>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
          className="mt-1 w-full rounded-md border-slate-300 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Notes</span>
        <textarea
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
          className="mt-1 w-full rounded-md border-slate-300 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={processing}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {processing ? 'Booking…' : 'Book room'}
      </button>
    </form>
  );
}
