import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
  const { upcomingBookings = [] } = usePage().props;

  return (
    <div className="min-h-screen bg-slate-100">
      <Head title="Dashboard" />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back!
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review your upcoming reservations and explore our workspaces.
          </p>
        </div>
      </header>
      <main className="mx-auto mt-6 max-w-7xl px-6 pb-16">
        <section className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming bookings</h2>
            <Link href="/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Manage bookings
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-200">
            {upcomingBookings.length === 0 && (
              <li className="py-8 text-center text-sm text-slate-500">
                You don't have any bookings yet. Browse rooms to create your first reservation.
              </li>
            )}
            {upcomingBookings.map((booking) => (
              <li key={booking.id} className="py-4">
                <p className="text-sm font-medium text-slate-900">{booking.title || booking.room.name}</p>
                <p className="text-sm text-slate-600">
                  {new Date(booking.starts_at).toLocaleString()} — {new Date(booking.ends_at).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
