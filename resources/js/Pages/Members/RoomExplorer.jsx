import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import RoomCard from '../../Components/RoomCard';

export default function RoomExplorer() {
  const { rooms = [], filters = {}, amenities = [] } = usePage().props;
  const { data, setData, get } = useForm({
    office_id: filters.office_id || '',
    capacity: filters.capacity || '',
    amenities: filters.amenities || [],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Head title="Rooms" />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Explore rooms</h1>
          <Link href="/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View bookings
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            get('/rooms', { preserveState: true, preserveScroll: true, replace: true });
          }}
          className="mt-6 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-4"
        >
          <label className="text-sm">
            <span className="text-slate-600">Minimum capacity</span>
            <input
              type="number"
              value={data.capacity}
              onChange={(e) => setData('capacity', e.target.value)}
              className="mt-1 w-full rounded-md border-slate-300 text-sm"
              placeholder="Any"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="text-slate-600">Amenities</span>
            <select
              multiple
              value={data.amenities}
              onChange={(e) =>
                setData(
                  'amenities',
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="mt-1 w-full rounded-md border-slate-300 text-sm"
            >
              {amenities.map((amenity) => (
                <option key={amenity.id} value={amenity.id}>
                  {amenity.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
            >
              Apply filters
            </button>
          </div>
        </form>
        <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </section>
      </main>
    </div>
  );
}
