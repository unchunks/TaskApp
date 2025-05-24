import React, { useState, useEffect } from 'react';
import './App.css';
import { compressImage } from './utils/imageUtils'; // Import compressImage
import ThemeToggle from './components/ThemeToggle';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import ImageModal from './components/ImageModal';
import EditTodoModal from './components/EditTodoModal';
import CameraModal from './components/CameraModal';
import useLocalStorage from './hooks/useLocalStorage';
import { checkDueDates } from './utils/notificationUtils';
import { sortTodos } from './utils/todoUtils';

function App() {
  // ローカルストレージに保存されたタスクを取得・保存するカスタムフック
  const [todos, setTodos] = useLocalStorage('todos', []);

  // State for the image captured for the new todo form
  const [imageForTodoForm, setImageForTodoForm] = useState(null);

  // 選択中の画像URL（モーダル表示用）
  const [selectedImage, setSelectedImage] = useState(null);

  // 編集対象のタスク
  const [editingTodo, setEditingTodo] = useState(null);

  // カメラモーダル表示の有無
  const [showCamera, setShowCamera] = useState(false);

  // ソート対象のキー（created, due, completed, name）
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'created');

  // ソートの順序（昇順 or 降順）
  const [sortOrder, setSortOrder] = useLocalStorage('sortOrder', 'desc');

  // Groups state
  const [groups, setGroups] = useLocalStorage('todoGroups', []);

  // 初回マウント時に通知許可をリクエストする
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // タスクの期限チェックを1分ごとに実行（通知のため）
  useEffect(() => {
    const interval = setInterval(() => {
      if (Notification.permission === 'granted') { // Only check if permission is granted
        const notifiedIds = checkDueDates(todos);
        if (notifiedIds && notifiedIds.length > 0) {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              notifiedIds.includes(todo.id)
                ? { ...todo, overdueNotified: true }
                : todo
            )
          );
        }
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos, setTodos]); // setTodos from useLocalStorage should be stable

  // タスクの完了状態をトグルする
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === id) {
          const toggledTodo = { ...todo, completed: !todo.completed };
          // If toggling to incomplete, reset overdueNotified
          // so it can re-notify if still overdue.
          if (toggledTodo.completed === false) {
            toggledTodo.overdueNotified = false;
          }
          return toggledTodo;
        }
        return todo;
      })
    );
  };

  // タスクを削除する
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 編集モーダルを開く
  const startEditing = (todo) => {
    setEditingTodo(todo);
  };

  // 画像モーダルを開く
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // 画像モーダルを閉じる
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // 新しいタスクを追加する
  const addTodo = (newTodo) => { // newTodo comes from TodoForm with most fields
    const newManualOrder = todos.length > 0 
      ? Math.max(...todos.map(t => typeof t.manualOrder === 'number' ? t.manualOrder : 0)) + 1 
      : 0;
    
    // Ensure all existing todos have manualOrder for safety before adding new one
    // This ensures that if todos were loaded from a previous version without manualOrder,
    // they get a sensible default.
    const updatedTodosExisting = todos.map((t, index) => ({
      ...t,
      manualOrder: typeof t.manualOrder === 'number' ? t.manualOrder : index
    }));

    const todoToAdd = {
      ...newTodo, // newTodo already has id, text, images, completed, dueDateTime, priority, groupId
      manualOrder: newManualOrder
    };
    setTodos([...updatedTodosExisting, todoToAdd]);
  };

  // 既存のタスクを更新する（編集完了時）
  const updateTodo = (updatedVersionOfTodo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === updatedVersionOfTodo.id) {
          const newTodo = { ...updatedVersionOfTodo };
          // If due date was changed OR if the task was completed and is now being un-completed
          // reset the overdueNotified flag to allow re-notification if it's (still) overdue.
          if (newTodo.dueDateTime !== todo.dueDateTime || (newTodo.completed === false && todo.completed === true) ) {
            newTodo.overdueNotified = false;
          }
          return newTodo;
        }
        return todo;
      })
    );
    setEditingTodo(null); // Close edit modal
  };

  // Add a new group
  const addGroup = (name, color) => {
    const newGroup = {
      id: `group-${Date.now()}`, // Simple unique ID generation
      name,
      color
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
    return newGroup; // Return the new group so its ID can be used immediately
  };

  // Update an existing group
  const updateGroup = (id, name, color) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === id ? { ...group, name, color } : group
      )
    );
  };

  // Delete a group and update associated todos
  const deleteGroup = (id) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== id));
    // Set todos associated with this group to have no group
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.groupId === id ? { ...todo, groupId: null } : todo
      )
    );
  };

  // Update the order of todos after drag-and-drop
  const updateTodoOrder = (reorderedTodos) => {
    // Assuming reorderedTodos is the full list with updated manualOrder values
    // or just the array in the new visual order.
    // If it's the array in new visual order, we need to update manualOrder based on index.
    const todosWithNewOrder = reorderedTodos.map((todo, index) => ({
      ...todo,
      manualOrder: index,
    }));
    setTodos(todosWithNewOrder);
  };

  // Function to add captured image to the currently editing todo
  const addCapturedImageToEditingTodo = async (file) => {
    if (!editingTodo) return;
    try {
      const compressed = await compressImage(file);
      const updatedImages = [...editingTodo.images, compressed];
      setEditingTodo(prev => ({ ...prev, images: updatedImages }));
    } catch (error) {
      console.error("Error compressing or adding image to editing todo:", error);
      // Optionally, inform the user about the error
    }
  };

  return (
    <div className="App">
      {/* テーマ切り替えボタン */}
      <ThemeToggle />

      <header className="App-header">
        <h1>TODOアプリ</h1>

        {/* ソート操作用のセレクトボックス */}
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created">追加順</option>
            <option value="due">期限順</option>
            <option value="completed">完了状態 (Completion Status)</option>
            <option value="name">名前順 (Name)</option>
            <option value="priority">優先度順 (Priority)</option>
            <option value="manual">手動 (Manual)</option> {/* New Option */}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>

        {/* タスク追加フォーム */}
        <TodoForm
          addTodo={addTodo}
          setShowCamera={setShowCamera}
          openImageModal={openImageModal}
          capturedImageForNewTodo={imageForTodoForm} // Pass the new state
          clearCapturedImageForNewTodo={() => setImageForTodoForm(null)} // Pass the setter
          groups={groups}
          addGroup={addGroup}
        />

        {/* タスクリスト（ソート済） */}
        <TodoList
          todos={sortTodos(todos, sortBy, sortOrder)}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          startEditing={startEditing}
          openImageModal={openImageModal}
          groups={groups}
          updateTodoOrder={updateTodoOrder} // Pass the new function
        />
      </header>

      {/* 画像モーダル（画像が選択されている場合に表示） */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          closeModal={closeImageModal}
        />
      )}

      {/* 編集モーダル（編集中のタスクがある場合に表示） */}
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          updateTodo={updateTodo}
          closeModal={() => setEditingTodo(null)}
          openImageModal={openImageModal}
          setShowCamera={setShowCamera}
          groups={groups}
          addGroup={addGroup}
          updateGroup={updateGroup}
        />
      )}

      {/* カメラモーダル（表示フラグがtrueのときに表示） */}
      {showCamera && (
        <CameraModal
          closeModal={() => setShowCamera(false)}
          onCapture={async (file) => {
            setShowCamera(false);
            if (editingTodo) {
              await addCapturedImageToEditingTodo(file);
            } else {
              try {
                const compressed = await compressImage(file);
                setImageForTodoForm(compressed); // Use the new state for TodoForm
              } catch (error) {
                console.error("Error compressing image for new todo:", error);
                // Optionally, inform the user
              }
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
