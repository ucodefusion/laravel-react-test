import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

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
    <div className="min-h-screen bg-slate-100">
      <Head title="Admin · Offices" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Manage offices</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Office</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Timezone</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offices.map((office) => (
                  <tr key={office.id}>
                    <td className="px-3 py-2 text-sm text-slate-900">{office.name}</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{office.timezone}</td>
                    <td className="px-3 py-2 text-right text-sm">
                      <button
                        onClick={() => setData({ id: office.id, name: office.name, address: office.address, timezone: office.timezone })}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => destroy(`/api/v1/offices/${office.id}`)}
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
            <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Update office' : 'Create office'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                transform((formData) => ({
                  name: formData.name,
                  address: formData.address,
                  timezone: formData.timezone,
                }));
                if (editing) {
                  put(`/api/v1/offices/${data.id}`, {
                    onSuccess: () => reset(),
                  });
                } else {
                  post('/api/v1/offices', {
                    onSuccess: () => reset(),
                  });
                }
              }}
              className="mt-4 space-y-4"
            >
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
                <span className="text-slate-600">Address</span>
                <textarea
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                />
                {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Timezone</span>
                <input
                  type="text"
                  value={data.timezone}
                  onChange={(e) => setData('timezone', e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {processing ? 'Saving…' : editing ? 'Update office' : 'Create office'}
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
}
