import React from 'react';
import { classNames } from '../Utils/classNames';

export default function Card({ as: Component = 'section', className, children, padded = true }) {
  return (
    <Component className={classNames('rounded-lg bg-white shadow', padded ? 'p-6' : undefined, className)}>
      {children}
    </Component>
  );
}
