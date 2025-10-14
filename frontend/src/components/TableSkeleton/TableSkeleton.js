import React from 'react';
import './TableSkeleton.css';

export default function TableSkeleton({ rows = 6, cols = 6, layout = null }) {
  // layout: optional array of numbers (flex ratios) length === cols
  const defaultCols = layout && Array.isArray(layout) ? layout.length : cols;
  return (
    <div className="table-skeleton" role="status" aria-live="polite">
      {Array.from({ length: rows }).map((_, r) => (
        <div className="s-row" key={r}>
          {Array.from({ length: defaultCols }).map((__, c) => (
            <div
              className="s-cell"
              key={c}
              style={layout ? { flex: `${layout[c]} 1 0` } : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
