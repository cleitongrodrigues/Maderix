import React from 'react';
import './InlineSpinner.css';

export default function InlineSpinner({ size = 14 }) {
  return <span className="inline-spinner" style={{ width: size, height: size }} aria-hidden="true" />;
}
