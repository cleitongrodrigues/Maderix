import React, { useState, useEffect } from 'react';

export default function SearchBar({ value = '', onChange, placeholder = 'Buscar por nome, email ou ID...', debounce = 300 }) {
  const [internal, setInternal] = useState(value);

  useEffect(() => setInternal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(internal), debounce);
    return () => clearTimeout(t);
  }, [internal, debounce, onChange]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        className="search-input"
        placeholder={placeholder}
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', width: 320 }}
      />
      {internal && (
        <button className="btn-primary" onClick={() => setInternal('')}>Limpar</button>
      )}
    </div>
  );
}
