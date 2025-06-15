import React from 'react';
import { Box, Typography } from '@mui/material';
import TodoItem from './TodoItem';

/**
 * TodoList コンポーネント
 * - ToDoの一覧を表示する。
 * - 各ToDoは TodoItem コンポーネントにより描画される。
 *
 * @param {Object[]} todos - 表示するToDoリストの配列
 * @param {Function} onToggle - チェックボックスの切り替え処理
 * @param {Function} onDelete - タスクの削除処理
 * @param {Function} onEdit - 編集モード開始の処理
 * @param {Array} groups - 利用可能なグループのリスト
 * @param {Function} openImageModal - 画像モーダルを開く処理
 */
const TodoList = ({ todos, onToggle, onDelete, onEdit, groups, openImageModal }) => {
  if (todos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          タスクがありません
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={onToggle}
          deleteTodo={onDelete}
          startEditing={onEdit}
          group={groups.find(g => g.id === todo.groupId) || null}
          openImageModal={openImageModal}
        />
      ))}
    </Box>
  );
};

export default TodoList;
