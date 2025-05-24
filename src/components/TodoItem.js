import React from 'react';
import { formatDueDateTime } from '../utils/dateUtils'; // 日時をフォーマットするユーティリティ関数
import { getPriorityColor, getPriorityTextColor, getPriorityStr } from '../utils/priorityUtils'; // 優先度に応じた値を返すユーティリティ関数

/**
 * タスク1件分を表示するコンポーネント
 * 
 * @param {Object} props.todo - 表示するタスクのデータ
 * @param {Function} props.toggleTodo - 完了状態の切り替え関数
 * @param {Function} props.deleteTodo - タスク削除の関数
 * @param {Function} props.startEditing - 編集開始関数
 * @param {Function} props.openImageModal - 画像クリック時にモーダルを開く関数
 * @param {Object | null} props.group - タスクが所属するグループオブジェクト（なければnull）
 * @param {boolean} props.isDragging - Optional prop to indicate if the item is currently being dragged
 * @param {Object} props - Additional props from Draggable (e.g., draggableProps, dragHandleProps)
 */
const TodoItem = React.forwardRef(({ todo, toggleTodo, deleteTodo, startEditing, openImageModal, group, isDragging, ...props }, ref) => {
  // Base styles
  let itemStyle = group ? { borderLeft: `5px solid ${group.color}`, paddingLeft: '10px' } : {};
  // Add userSelect style when dragging
  if (isDragging) {
    itemStyle = { ...itemStyle, userSelect: 'none' };
  }

  const itemClassName = `todo-item ${todo.completed ? 'completed' : ''} ${group ? 'has-group' : ''} ${isDragging ? 'dragging' : ''}`;

  return (
    // タスク1件分のリストアイテム
    <li className={itemClassName} style={itemStyle} ref={ref} {...props}>
      {/* チェックボックス：タスクの完了状態の切り替え */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => { // Added stopPropagation just in case, though direct onChange usually doesn't bubble like click
          e.stopPropagation();
          toggleTodo(todo.id);
        }}
        className="todo-checkbox"
      />

      {/* タスク本文・画像・期限をまとめたコンテナ */}
      <div className="todo-content">
        {/* 画像が1枚以上ある場合に表示 */}
        {todo.images && todo.images.length > 0 && (
          <div className="todo-images">
            {todo.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`タスク画像 ${index + 1}`}
                className="todo-image"
                onClick={(e) => {
                  e.stopPropagation(); // クリックイベントが親要素に伝播するのを防止
                  openImageModal(image); // 画像モーダルを開く
                }}
              />
            ))}
          </div>
        )}

        {/* テキストと期限表示（テキストクリックで完了トグル） */}
        <div
          className="todo-text-container"
          onClick={(e) => { // Ensure this click is for toggling and doesn't get mixed with other actions
            e.stopPropagation();
            toggleTodo(todo.id);
          }}
        >
          {/* Group Info Display */}
          {group && (
            <span className="group-name-badge" style={{ 
              backgroundColor: group.color, 
              color: '#fff', // Assuming white text, adjust if needed for contrast
              padding: '2px 6px', 
              borderRadius: '4px',
              fontSize: '0.8em',
              marginRight: '8px' // Add some spacing
            }}>
              {group.name}
            </span>
          )}

          {/* 優先度バッジ */}
          <span
            className="priority-badge"
            style={{
              backgroundColor: getPriorityColor(todo.priority),
              color: getPriorityTextColor(todo.priority),
              padding: '2px 6px',
              borderRadius: '12px',
              marginLeft: '8px',
              fontSize: '0.85rem',
            }}
          >
            優先度 {getPriorityStr(todo.priority)}
          </span>

          {/* タスク内容（完了済みならスタイル変更） */}
          <span className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </span>

          {/* 締切日時がある場合のみ表示 */}
          {todo.dueDateTime && (
            <span className={`due-date ${todo.completed ? 'completed' : ''}`}>
              期限: {formatDueDateTime(todo.dueDateTime)}
            </span>
          )}
        </div>
      </div>

      {/* 編集・削除ボタン */}
      <div className="todo-actions">
        <button
          onClick={(e) => {
            e.stopPropagation(); // クリックが完了トグルに影響しないようにする
            startEditing(todo); // 編集モーダルを開く
          }}
          className="edit-button"
        >
          編集
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // 同上
            deleteTodo(todo.id); // タスクを削除
          }}
          className="delete-button"
        >
          削除
        </button>
      </div>
    </li>
  );
});

export default TodoItem;
