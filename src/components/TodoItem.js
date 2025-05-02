import React from 'react';
import { formatDueDateTime } from '../utils/dateUtils';

function TodoItem({ todo, toggleTodo, deleteTodo, startEditing, openImageModal }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="todo-checkbox"
      />
      <div className="todo-content">
        {todo.images && todo.images.length > 0 && (
          <div className="todo-images">
            {todo.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`タスク画像 ${index + 1}`}
                className="todo-image"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal(image);
                }}
              />
            ))}
          </div>
        )}
        <div
          className="todo-text-container"
          onClick={() => toggleTodo(todo.id)}
        >
          <span className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </span>
          {todo.dueDateTime && (
            <span className={`due-date ${todo.completed ? 'completed' : ''}`}>
              期限: {formatDueDateTime(todo.dueDateTime)}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            startEditing(todo);
          }}
          className="edit-button"
        >
          編集
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
          }}
          className="delete-button"
        >
          削除
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
