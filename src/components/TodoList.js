import React from 'react';
import TodoItem from './TodoItem';

/**
 * TodoList コンポーネント
 * - ToDoの一覧を表示する。
 * - 各ToDoは TodoItem コンポーネントにより描画される。
 *
 * @param {Object[]} todos - 表示するToDoリストの配列
 * @param {Function} toggleTodo - チェックボックスの切り替え処理
 * @param {Function} deleteTodo - タスクの削除処理
 * @param {Function} startEditing - 編集モード開始の処理
 * @param {Function} openImageModal - 画像モーダルを開く処理
 */
function TodoList({ todos, toggleTodo, deleteTodo, startEditing, openImageModal }) {
  return (
    <ul className="todo-list">
      {/* 各 ToDo を個別の TodoItem コンポーネントとしてレンダリング */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}                  // 各要素の一意なキー（Reactの再描画最適化用）
          todo={todo}                    // タスクオブジェクトを渡す
          toggleTodo={toggleTodo}        // チェック切り替え関数
          deleteTodo={deleteTodo}        // 削除関数
          startEditing={startEditing}    // 編集開始関数
          openImageModal={openImageModal} // 画像モーダル表示関数
        />
      ))}
    </ul>
  );
}

export default TodoList;
