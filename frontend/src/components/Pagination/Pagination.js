import React from "react";
import "./Pagination.css";

// Props:
// totalItems: number
// pageSize: number
// currentPage: number
// onPageChange: function(page)
// onPageSizeChange?: function(size)
// pageSizeOptions?: array
// showCount?: boolean
export default function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25],
  showCount = true,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const goto = (p) => onPageChange && onPageChange(Math.max(1, Math.min(totalPages, p)));

  return (
    <div className="pagination-controls">
      <button
        className="pagination-button nav-button"
        onClick={() => goto(1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>

      <button
        className="pagination-button nav-button"
        onClick={() => goto(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* page numbers */}
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => goto(i + 1)}
          className={currentPage === i + 1 ? "pagination-button active" : "pagination-button"}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="pagination-button nav-button"
        onClick={() => goto(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>

      <button
        className="pagination-button nav-button"
        onClick={() => goto(totalPages)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>

      {showCount && (
        <span className="pagination-count"> — {totalItems} registros</span>
      )}

      {/* pageSize é controlado pela página que usa o componente; seletor removido para comportamento fixo */}
    </div>
  );
}
