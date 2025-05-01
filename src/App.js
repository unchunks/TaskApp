import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [sortBy, setSortBy] = useState('created'); // 'created', 'due', 'completed'
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const notificationRef = useRef(null);

  // 通知の許可をリクエスト
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // タスクの期限チェック
  useEffect(() => {
    const checkDueDates = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (!todo.completed && todo.dueDateTime) {
          const dueDate = new Date(todo.dueDateTime);
          const timeDiff = dueDate - now;
          
          // 期限が1時間以内の場合に通知
          if (timeDiff > 0 && timeDiff <= 3600000) {
            if (Notification.permission === 'granted') {
              new Notification('タスクの期限が近づいています', {
                body: `${todo.text}の期限が1時間以内です`,
                icon: '/logo192.png'
              });
            }
          }
        }
      });
    };

    const interval = setInterval(checkDueDates, 60000); // 1分ごとにチェック
    return () => clearInterval(interval);
  }, [todos]);

  // タスクが変更されるたびにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 1080; // スマホでも見やすいサイズに調整
          const maxHeight = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // 最小限の圧縮
          const quality = 0.8;
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // スマホの場合は最大2枚までに制限
      const isMobile = window.innerWidth <= 768;
      const maxImages = isMobile ? 2 : 5;
      
      if (files.length > maxImages) {
        alert(`画像は最大${maxImages}枚まで選択できます`);
        return;
      }

      const newFileNames = files.map(file => file.name);
      setFileNames(prev => [...prev, ...newFileNames]);

      try {
        const batchSize = 1;
        const compressedImages = [];
        
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(file => compressImage(file))
          );
          compressedImages.push(...batchResults);
          setImages(prev => [...prev, ...batchResults]);
          
          if (i + batchSize < files.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('画像の圧縮に失敗しました:', error);
      }
    }
  };

  const clearFileInput = () => {
    setImages([]);
    setFileNames([]);
    setDueDate('');
    setDueTime('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '' && images.length === 0) return;
    
    const dueDateTime = dueDate && dueTime 
      ? new Date(`${dueDate}T${dueTime}`).toISOString()
      : null;

    const newTodo = {
      id: Date.now(),
      text: input,
      images: [...images],
      completed: false,
      dueDateTime: dueDateTime
    };
    setTodos([...todos, newTodo]);
    setInput('');
    clearFileInput();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const formatDueDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const sortTodos = (todos) => {
    switch (sortBy) {
      case 'created':
        return [...todos].sort((a, b) => b.id - a.id);
      case 'due':
        return [...todos].sort((a, b) => {
          if (!a.dueDateTime && !b.dueDateTime) return 0;
          if (!a.dueDateTime) return 1;
          if (!b.dueDateTime) return -1;
          return new Date(a.dueDateTime) - new Date(b.dueDateTime);
        });
      case 'completed':
        return [...todos].sort((a, b) => {
          if (a.completed === b.completed) return b.id - a.id;
          return a.completed ? 1 : -1;
        });
      default:
        return todos;
    }
  };

  return (
    <div className="App">
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
          </select>
        </div>
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="新しいタスクを入力"
              className="todo-input"
            />
            <div className="file-input-container">
              <label className="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="image-input"
                  multiple
                />
                <span className="file-input-button">画像を選択</span>
              </label>
              {fileNames.length > 0 && (
                <div className="file-info-container">
                  {fileNames.map((fileName, index) => (
                    <div key={index} className="file-info">
                      <span className="file-name">{fileName}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="clear-file-button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="due-date-container">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="due-date-input"
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="due-time-input"
            />
          </div>
          {images.length > 0 && (
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img 
                    src={image} 
                    alt={`プレビュー ${index + 1}`}
                    onClick={() => openImageModal(image)}
                  />
                </div>
              ))}
            </div>
          )}
          <button type="submit" className="add-button">追加</button>
        </form>
        <ul className="todo-list">
          {sortTodos(todos).map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo.id);
                }}
                className="delete-button"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </header>

      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeImageModal}>
              ✕
            </button>
            <img src={selectedImage} alt="拡大表示" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
