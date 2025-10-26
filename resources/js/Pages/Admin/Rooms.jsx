import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import DataTable from '../../Components/DataTable';
import PrimaryButton from '../../Components/PrimaryButton';
import { CheckboxField, FormField, SelectInput, TextInput } from '../../Components/FormControls';

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
    <AdminLayout title="Admin · Rooms" heading="Manage rooms">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <DataTable
            columns={[
              { key: 'name', label: 'Room' },
              { key: 'capacity', label: 'Capacity', className: 'w-24' },
              { key: 'status', label: 'Status', className: 'w-28' },
              { key: 'actions', label: '', className: 'w-32 text-right' },
            ]}
            emptyState="No rooms configured yet."
          >
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-3 py-2 text-sm text-slate-900">{room.name}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{room.capacity}</td>
                <td className="px-3 py-2 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      room.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {room.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-sm">
                  <button
                    type="button"
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
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => destroy(`/api/v1/rooms/${room.id}`)}
                    className="ml-3 font-medium text-rose-600 hover:text-rose-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>
        <Card>
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

              const action = editing
                ? put(`/api/v1/rooms/${data.id}`, {
                    onSuccess: () => reset(),
                  })
                : post('/api/v1/rooms', {
                    onSuccess: () => reset(),
                  });

              return action;
            }}
            className="mt-4 space-y-4"
          >
            <FormField label="Office" htmlFor="room-office">
              <SelectInput
                id="room-office"
                value={data.office_id}
                onChange={(e) => setData('office_id', e.target.value)}
              >
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </SelectInput>
            </FormField>
            <FormField label="Name" htmlFor="room-name" error={errors.name}>
              <TextInput
                id="room-name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
            </FormField>
            <FormField label="Capacity" htmlFor="room-capacity" error={errors.capacity}>
              <TextInput
                id="room-capacity"
                type="number"
                min="1"
                value={data.capacity}
                onChange={(e) => setData('capacity', e.target.value)}
              />
            </FormField>
            <FormField label="Type" htmlFor="room-type">
              <SelectInput
                id="room-type"
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
              >
                <option value="meeting_room">Meeting room</option>
                <option value="desk">Desk</option>
                <option value="pod">Pod</option>
                <option value="other">Other</option>
              </SelectInput>
            </FormField>
            <CheckboxField
              id="room-active"
              label="Active"
              checked={data.is_active}
              onChange={(e) => setData('is_active', e.target.checked)}
            />
            <FormField label="Amenities" htmlFor="room-amenities">
              <SelectInput
                id="room-amenities"
                multiple
                value={data.amenity_ids}
                onChange={(e) =>
                  setData(
                    'amenity_ids',
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="h-32"
              >
                {amenities.map((amenity) => (
                  <option key={amenity.id} value={String(amenity.id)}>
                    {amenity.name}
                  </option>
                ))}
              </SelectInput>
            </FormField>
            <PrimaryButton type="submit" disabled={processing}>
              {processing ? 'Saving…' : editing ? 'Update room' : 'Create room'}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
