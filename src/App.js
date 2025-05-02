import React, { useState, useEffect } from 'react';
import './App.css';
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
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');

  // 通知の許可をリクエスト
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // タスクの期限チェック
  useEffect(() => {
    const interval = setInterval(() => checkDueDates(todos), 60000); // 1分ごとにチェック
    return () => clearInterval(interval);
  }, [todos]);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (updatedTodo) => {
    setTodos(todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
    setEditingTodo(null);
  };

  return (
    <div className="App">
      <ThemeToggle />
      <header className="App-header">
        <h1>TODOアプリ</h1>
        
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created">追加順</option>
            <option value="due">期限順</option>
            <option value="completed">完了状態</option>
            <option value="name">名前順</option>
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

        <TodoForm 
          addTodo={addTodo} 
          setShowCamera={setShowCamera}
          openImageModal={openImageModal}
        />

        <TodoList
          todos={sortTodos(todos, sortBy, sortOrder)}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          startEditing={startEditing}
          openImageModal={openImageModal}
        />
      </header>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          closeModal={closeImageModal}
        />
      )}

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          updateTodo={updateTodo}
          closeModal={() => setEditingTodo(null)}
          openImageModal={openImageModal}
          setShowCamera={setShowCamera}
        />
      )}

      {showCamera && (
        <CameraModal
          closeModal={() => setShowCamera(false)}
          onCapture={(file) => {
            // カメラモードを閉じる
            setShowCamera(false);
            // 撮影した画像は編集中のタスクか新規タスクに追加
            return { file, forEdit: !!editingTodo };
          }}
        />
      )}
    </div>
  );
}

export default App;
