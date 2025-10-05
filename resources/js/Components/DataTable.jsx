import React from 'react';
import { classNames } from '../Utils/classNames';

export default function DataTable({ columns, children, emptyState }) {
  return (
    <table className="min-w-full divide-y divide-slate-200">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key ?? column.label}
              className={classNames(
                'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
                column.className
              )}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <tr>
            <td
              className="px-3 py-6 text-center text-sm text-slate-500"
              colSpan={columns.length}
            >
              {emptyState}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
