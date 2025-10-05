import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import BookingForm from '../../Components/BookingForm';

export default function Bookings() {
  const { bookings = [], rooms = [] } = usePage().props;
  const { delete: destroy } = useForm();

  return (
    <div className="min-h-screen bg-slate-100">
      <Head title="Bookings" />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
            <h1 className="text-xl font-semibold text-slate-900">My bookings</h1>
            <ul className="mt-4 divide-y divide-slate-200">
              {bookings.length === 0 && (
                <li className="py-10 text-center text-sm text-slate-500">No bookings yet.</li>
              )}
              {bookings.map((booking) => (
                <li key={booking.id} className="flex items-start justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{booking.title || booking.room.name}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(booking.starts_at).toLocaleString()} — {new Date(booking.ends_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      destroy(`/api/v1/bookings/${booking.id}`, {
                        preserveScroll: true,
                      })
                    }
                    className="text-sm font-medium text-rose-600 hover:text-rose-500"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <aside className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">Create a booking</h2>
            <BookingForm rooms={rooms} />
          </aside>
        </div>
      </main>
    </div>
  );
}
