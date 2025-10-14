import React from 'react';
import './Highlight.css';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Highlight({ text = '', query = '' }) {
  if (!query) return <>{text}</>;
  if (!text) return null;
  const q = String(query).trim();
  if (!q) return <>{text}</>;
  const parts = String(text).split(new RegExp(`(${escapeRegExp(q)})`, 'ig'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark className="hl-mark" key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
