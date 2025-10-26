import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import DataTable from '../../Components/DataTable';
import PrimaryButton from '../../Components/PrimaryButton';
import { FormField, TextInput, TextareaInput } from '../../Components/FormControls';

export default function AdminOffices() {
  const { offices = [] } = usePage().props;
  const { data, setData, post, put, delete: destroy, processing, errors, reset, transform } = useForm({
    id: null,
    name: '',
    address: '',
    timezone: 'Pacific/Auckland',
  });

  const editing = Boolean(data.id);

  return (
    <AdminLayout title="Admin · Offices" heading="Manage offices">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <DataTable
            columns={[
              { key: 'name', label: 'Office' },
              { key: 'timezone', label: 'Timezone' },
              { key: 'actions', label: '', className: 'w-32 text-right' },
            ]}
            emptyState="No offices available."
          >
            {offices.map((office) => (
              <tr key={office.id}>
                <td className="px-3 py-2 text-sm text-slate-900">{office.name}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{office.timezone}</td>
                <td className="px-3 py-2 text-right text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setData({ id: office.id, name: office.name, address: office.address, timezone: office.timezone })
                    }
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => destroy(`/api/v1/offices/${office.id}`)}
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
          <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Update office' : 'Create office'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              transform((formData) => ({
                name: formData.name,
                address: formData.address,
                timezone: formData.timezone,
              }));
              const action = editing
                ? put(`/api/v1/offices/${data.id}`, {
                    onSuccess: () => reset(),
                  })
                : post('/api/v1/offices', {
                    onSuccess: () => reset(),
                  });

              return action;
            }}
            className="mt-4 space-y-4"
          >
            <FormField label="Name" htmlFor="office-name" error={errors.name}>
              <TextInput
                id="office-name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
            </FormField>
            <FormField label="Address" htmlFor="office-address" error={errors.address}>
              <TextareaInput
                id="office-address"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                rows={4}
              />
            </FormField>
            <FormField label="Timezone" htmlFor="office-timezone">
              <TextInput
                id="office-timezone"
                type="text"
                value={data.timezone}
                onChange={(e) => setData('timezone', e.target.value)}
              />
            </FormField>
            <PrimaryButton type="submit" disabled={processing}>
              {processing ? 'Saving…' : editing ? 'Update office' : 'Create office'}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
