import React from 'react';
import { Link } from '@inertiajs/react';

export default function RoomCard({ room }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">{room.type.replace('_', ' ')}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{room.name}</h3>
        <p className="mt-2 text-sm text-slate-600">Capacity: {room.capacity}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {room.amenities?.map((amenity) => (
            <span key={amenity.id} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              {amenity.name}
            </span>
          ))}
        </div>
      </div>
      <Link
        href={`/rooms/${room.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        View availability
      </Link>
    </div>
  );
}
