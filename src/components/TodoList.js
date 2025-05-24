import React from 'react';
import TodoItem from './TodoItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
 * @param {Array} groups - 利用可能なグループのリスト
 * @param {Function} updateTodoOrder - Function to update todo order after drag-and-drop
 * @param {string} sortBy - Current sort criteria (e.g., 'manual', 'created', etc.)
 */
function TodoList({ todos, toggleTodo, deleteTodo, startEditing, openImageModal, groups, updateTodoOrder, sortBy }) {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list
    if (result.destination.index === result.source.index) return; // Dropped at the same place

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateTodoOrder(items); // This function from App.js updates the manualOrder and sets state
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="todosDroppable">
        {(provided, snapshot) => (
          <ul
            className="todo-list" // Retaining original class name if it's a ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            // Optional: style={{ backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'transparent' }}
          >
            {todos.map((todo, index) => {
              const group = todo.groupId && groups ? groups.find(g => g.id === todo.groupId) : null;
              return (
                <Draggable
                  key={todo.id.toString()} // Draggable key must be a string
                  draggableId={todo.id.toString()} // DraggableId must be a string
                  index={index}
                  isDragDisabled={sortBy !== 'manual'} // Disable drag if not in manual sort mode
                >
                  {(providedDraggable, snapshotDraggable) => (
                    <TodoItem
                      todo={todo}
                      group={group}
                      toggleTodo={toggleTodo}
                      deleteTodo={deleteTodo}
                      startEditing={startEditing}
                      openImageModal={openImageModal}
                      // Props for @hello-pangea/dnd:
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      isDragging={snapshotDraggable.isDragging}
                    />
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TodoList;
