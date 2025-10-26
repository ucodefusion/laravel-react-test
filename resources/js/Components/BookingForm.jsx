import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';
import { FormField, SelectInput, TextInput, TextareaInput } from './FormControls';

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
      <FormField label="Room" htmlFor="booking-room" error={errors.room_id}>
        <SelectInput
          id="booking-room"
          value={data.room_id}
          onChange={(e) => setData('room_id', e.target.value)}
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </SelectInput>
      </FormField>
      <FormField label="Start time" htmlFor="booking-start" error={errors.starts_at}>
        <TextInput
          id="booking-start"
          type="datetime-local"
          value={data.starts_at}
          onChange={(e) => setData('starts_at', e.target.value)}
        />
      </FormField>
      <FormField label="End time" htmlFor="booking-end" error={errors.ends_at}>
        <TextInput
          id="booking-end"
          type="datetime-local"
          value={data.ends_at}
          onChange={(e) => setData('ends_at', e.target.value)}
        />
      </FormField>
      <FormField label="Attendees" htmlFor="booking-attendees" error={errors.attendee_count}>
        <TextInput
          id="booking-attendees"
          type="number"
          min="1"
          value={data.attendee_count}
          onChange={(e) => setData('attendee_count', e.target.value)}
        />
      </FormField>
      <FormField label="Title" htmlFor="booking-title">
        <TextInput
          id="booking-title"
          type="text"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
        />
      </FormField>
      <FormField label="Notes" htmlFor="booking-notes">
        <TextareaInput
          id="booking-notes"
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
          rows={4}
        />
      </FormField>
      <PrimaryButton type="submit" disabled={processing}>
        {processing ? 'Booking…' : 'Book room'}
      </PrimaryButton>
    </form>
  );
}
