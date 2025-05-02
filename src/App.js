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
  // ローカルストレージに保存されたタスクを取得・保存するカスタムフック
  const [todos, setTodos] = useLocalStorage('todos', []);

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

  // 初回マウント時に通知許可をリクエストする
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // タスクの期限チェックを1分ごとに実行（通知のため）
  useEffect(() => {
    const interval = setInterval(() => checkDueDates(todos), 60000);
    return () => clearInterval(interval); // コンポーネントアンマウント時にクリーンアップ
  }, [todos]);

  // タスクの完了状態をトグルする
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
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
  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  // 既存のタスクを更新する（編集完了時）
  const updateTodo = (updatedTodo) => {
    setTodos(todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
    setEditingTodo(null); // 編集モーダルを閉じる
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
            <option value="completed">完了状態</option>
            <option value="name">名前順</option>
            <option value="priority">優先度順</option>
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
        />

        {/* タスクリスト（ソート済） */}
        <TodoList
          todos={sortTodos(todos, sortBy, sortOrder)}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          startEditing={startEditing}
          openImageModal={openImageModal}
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
        />
      )}

      {/* カメラモーダル（表示フラグがtrueのときに表示） */}
      {showCamera && (
        <CameraModal
          closeModal={() => setShowCamera(false)}
          onCapture={(file) => {
            // モーダルを閉じる
            setShowCamera(false);
            // 撮影画像を返すが、ここでは実際の処理は未実装のよう
            return { file, forEdit: !!editingTodo };
          }}
        />
      )}
    </div>
  );
}

export default App;
