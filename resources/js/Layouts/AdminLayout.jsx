import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminLayout({ title, heading, actions, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      {title && <Head title={title} />}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {heading && <h1 className="text-2xl font-semibold text-slate-900">{heading}</h1>}
          {actions}
        </div>
        <div className="mt-8 space-y-8">{children}</div>
      </main>
    </div>
  );
}
