import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function AdminRooms() {
  const { rooms = [], offices = [], amenities = [] } = usePage().props;
  const { data, setData, post, put, delete: destroy, processing, errors, reset, transform } = useForm({
    id: null,
    office_id: offices[0]?.id || '',
    name: '',
    capacity: 1,
    type: 'meeting_room',
    is_active: true,
    amenity_ids: [],
  });

  const editing = Boolean(data.id);

  return (
    <div className="min-h-screen bg-slate-100">
      <Head title="Admin · Rooms" />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Manage rooms</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Room</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Capacity</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-3 py-2 text-sm text-slate-900">{room.name}</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{room.capacity}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${room.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {room.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-sm">
                      <button
                        onClick={() =>
                          setData({
                            ...data,
                            id: room.id,
                            office_id: room.office_id,
                            name: room.name,
                            capacity: room.capacity,
                            type: room.type,
                            is_active: room.is_active,
                            amenity_ids: room.amenities?.map((a) => String(a.id)) || [],
                          })
                        }
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => destroy(`/api/v1/rooms/${room.id}`)}
                        className="ml-3 text-rose-600 hover:text-rose-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <aside className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Update room' : 'Create room'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                transform((formData) => ({
                  office_id: formData.office_id,
                  name: formData.name,
                  capacity: Number(formData.capacity),
                  type: formData.type,
                  is_active: formData.is_active,
                  amenity_ids: formData.amenity_ids.map((id) => Number(id)),
                }));
                if (editing) {
                  put(`/api/v1/rooms/${data.id}`, {
                    onSuccess: () => reset(),
                  });
                } else {
                  post('/api/v1/rooms', {
                    onSuccess: () => reset(),
                  });
                }
              }}
              className="mt-4 space-y-4"
            >
              <label className="block text-sm">
                <span className="text-slate-600">Office</span>
                <select
                  value={data.office_id}
                  onChange={(e) => setData('office_id', e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                >
                  {offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Name</span>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                />
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Capacity</span>
                <input
                  type="number"
                  min="1"
                  value={data.capacity}
                  onChange={(e) => setData('capacity', e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                />
                {errors.capacity && <p className="mt-1 text-xs text-rose-600">{errors.capacity}</p>}
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Type</span>
                <select
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                >
                  <option value="meeting_room">Meeting room</option>
                  <option value="desk">Desk</option>
                  <option value="pod">Pod</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-slate-600">Active</span>
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Amenities</span>
                <select
                  multiple
                  value={data.amenity_ids}
                  onChange={(e) =>
                    setData(
                      'amenity_ids',
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                >
                  {amenities.map((amenity) => (
                    <option key={amenity.id} value={String(amenity.id)}>
                      {amenity.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {processing ? 'Saving…' : editing ? 'Update room' : 'Create room'}
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
}
