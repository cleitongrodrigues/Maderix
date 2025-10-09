import React from "react";
import "../Pagination/Pagination.css"; // reuse global styles; component uses existing .btn-action-trigger styles

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
  showView = false,
  showEdit = true,
  showDelete = true,
  viewTitle = "Ver",
  editTitle = "Editar",
  deleteTitle = "Excluir",
}) {
  return (
    <div className="action-buttons">
      {showView && (
        <button className="btn-action-trigger" title={viewTitle} onClick={onView}>
          🔍
        </button>
      )}

      {showEdit && (
        <button className="btn-action-trigger edit-btn" title={editTitle} onClick={onEdit}>
          ✎
        </button>
      )}

      {showDelete && (
        <button className="btn-action-trigger delete-btn" title={deleteTitle} onClick={onDelete}>
          🗑️
        </button>
      )}
    </div>
  );
}
