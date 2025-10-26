import React from 'react';
import { classNames } from '../Utils/classNames';

export default function PrimaryButton({ className, children, ...props }) {
  return (
    <button
      className={classNames(
        'inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
