import React, { useState, useRef } from 'react';
import { compressImage } from '../utils/imageUtils';

function TodoForm({ addTodo, setShowCamera, openImageModal }) {
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const fileInputRef = useRef(null);

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
    
    addTodo(newTodo);
    setInput('');
    clearFileInput();
  };

  return (
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
          <div className="file-input-buttons">
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
            <label className="file-input-label">
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="file-input-button"
              >
                カメラで撮影
              </button>
            </label>
          </div>
        </div>
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
  );
}

export default TodoForm;
