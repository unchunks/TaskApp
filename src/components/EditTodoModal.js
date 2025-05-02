import React, { useState, useRef, useEffect } from 'react';
import { compressImage } from '../utils/imageUtils';

function EditTodoModal({ todo, updateTodo, closeModal, openImageModal, setShowCamera }) {
  const [editText, setEditText] = useState(todo.text);
  const [editImages, setEditImages] = useState([...todo.images]);
  const [editFileNames, setEditFileNames] = useState(todo.images.map((_, index) => `画像${index + 1}`));
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');
  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (todo.dueDateTime) {
      const date = new Date(todo.dueDateTime);
      setEditDueDate(date.toISOString().split('T')[0]);
      setEditDueTime(date.toTimeString().slice(0, 5));
    }
  }, [todo]);

  const handleEditImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const isMobile = window.innerWidth <= 768;
      const maxImages = isMobile ? 2 : 5;

      if (files.length > maxImages) {
        alert(`画像は最大${maxImages}枚まで選択できます`);
        return;
      }

      const newFileNames = files.map(file => file.name);
      setEditFileNames(prev => [...prev, ...newFileNames]);

      try {
        const batchSize = 1;
        const compressedImages = [];
        
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(file => compressImage(file))
          );
          compressedImages.push(...batchResults);
          setEditImages(prev => [...prev, ...batchResults]);
          
          if (i + batchSize < files.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('画像の圧縮に失敗しました:', error);
      }
    }
  };

  const removeEditImage = (index) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
    setEditFileNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const dueDateTime = editDueDate && editDueTime 
      ? new Date(`${editDueDate}T${editDueTime}`).toISOString()
      : null;

    const updatedTodo = {
      ...todo,
      text: editText,
      images: [...editImages],
      dueDateTime: dueDateTime
    };

    updateTodo(updatedTodo);
  };

  return (
    <div className="edit-modal" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal-button" onClick={closeModal}>
          ✕
        </button>
        <h2>タスクを編集</h2>
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="input-container">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="タスクを編集"
              className="todo-input"
            />
            <div className="file-input-container">
              <label className="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  ref={editFileInputRef}
                  className="image-input"
                  multiple
                />
                <span className="file-input-button">画像を選択</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="file-input-button"
              >
                カメラで撮影
              </button>
              {editFileNames.length > 0 && (
                <div className="file-info-container">
                  {editFileNames.map((fileName, index) => (
                    <div key={index} className="file-info">
                      <span className="file-name">{fileName}</span>
                      <button
                        type="button"
                        onClick={() => removeEditImage(index)}
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
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="due-date-input"
            />
            <input
              type="time"
              value={editDueTime}
              onChange={(e) => setEditDueTime(e.target.value)}
              className="due-time-input"
            />
          </div>
          {editImages.length > 0 && (
            <div className="image-preview-container">
              {editImages.map((image, index) => (
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
          <button type="submit" className="save-button">保存</button>
        </form>
      </div>
    </div>
  );
}

export default EditTodoModal;
