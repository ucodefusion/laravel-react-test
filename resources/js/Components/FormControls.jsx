import React, { forwardRef } from 'react';
import { classNames } from '../Utils/classNames';

export function FormField({ label, htmlFor, error, description, children }) {
  return (
    <div className="text-sm">
      {label && (
        <label htmlFor={htmlFor} className="block text-slate-600">
          {label}
        </label>
      )}
      <div className={label ? 'mt-1' : undefined}>{children}</div>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

const inputBase =
  'w-full rounded-md border-slate-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';

export const TextInput = forwardRef(function TextInput({ className, ...props }, ref) {
  return <input ref={ref} className={classNames(inputBase, className)} {...props} />;
});

export const SelectInput = forwardRef(function SelectInput({ className, ...props }, ref) {
  return <select ref={ref} className={classNames(inputBase, className)} {...props} />;
});

export const TextareaInput = forwardRef(function TextareaInput({ className, rows = 3, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={classNames(inputBase, className)} {...props} />;
});

export function CheckboxField({ id, label, error, description, ...props }) {
  return (
    <div className="text-sm">
      <label htmlFor={id} className="flex items-center gap-2 text-slate-600">
        <input
          id={id}
          type="checkbox"
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          {...props}
        />
        <span>{label}</span>
      </label>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
