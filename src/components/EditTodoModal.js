import React, { useState, useRef, useEffect } from 'react';
import { compressImage } from '../utils/imageUtils';
import { getPriorityStr } from '../utils/priorityUtils';

function EditTodoModal({ todo, updateTodo, closeModal, openImageModal, setShowCamera, groups, addGroup, updateGroup }) {
  // タスクのテキスト、画像、期限を編集するための状態
  const [editText, setEditText] = useState(todo.text); // タスクのテキスト
  const [editImages, setEditImages] = useState([...todo.images]); // 編集中の画像
  const [editFileNames, setEditFileNames] = useState(todo.images.map((_, index) => `画像${index + 1}`)); // 編集中の画像ファイル名
  const [editDueDate, setEditDueDate] = useState(''); // 編集中の期日（YYYY-MM-DD）
  const [editDueTime, setEditDueTime] = useState(''); // 編集中の期限時間（HH:MM）
  const [priority, setPriority] = useState(todo.priority);        // 優先度（0-5）
  const editFileInputRef = useRef(null); // ファイル入力フィールドの参照

  // Group related states
  const [selectedGroupId, setSelectedGroupId] = useState(todo.groupId || '');
  const [showNewGroupInputs, setShowNewGroupInputs] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#FFFFFF');

  // 初期タスクに期限があればそれをセットする
  useEffect(() => {
    if (todo.dueDateTime) {
      const date = new Date(todo.dueDateTime);
      setEditDueDate(date.toISOString().split('T')[0]);
      setEditDueTime(date.toTimeString().slice(0, 5));
    } else {
      setEditDueDate('');
      setEditDueTime('');
    }
  }, [todo.dueDateTime]);

  // useEffect to sync editImages and editFileNames with todo.images
  useEffect(() => {
    // Update editImages state if todo.images prop changes
    setEditImages([...todo.images]);
    
    // Update editFileNames based on the new todo.images array
    // This will generate generic names like "Image 1", "Image 2", etc.
    setEditFileNames(todo.images.map((_, index) => `Image ${index + 1}`)); // Using "Image" as per instructions
    
  }, [todo.images]); // Dependency array includes todo.images

  // useEffect to initialize selectedGroupId based on todo.groupId and groups
  useEffect(() => {
      if (todo.groupId && groups && groups.find(g => g.id === todo.groupId)) {
          setSelectedGroupId(todo.groupId);
      } else if (todo.groupId && groups && !groups.find(g => g.id === todo.groupId)) {
          setSelectedGroupId(''); // Group was deleted, set to No Group
      } else {
          setSelectedGroupId(''); // Default to No Group
      }
  }, [todo.groupId, groups]);

  // useEffect to manage visibility of new group input fields
  useEffect(() => {
      if (selectedGroupId === 'create_new_group') {
          setShowNewGroupInputs(true);
      } else {
          setShowNewGroupInputs(false);
      }
  }, [selectedGroupId]);

  // 画像が変更されたときに呼ばれる関数
  const handleEditImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // モバイルでは最大2枚、それ以外では最大5枚に制限
      const isMobile = window.innerWidth <= 768;
      const maxImages = isMobile ? 2 : 5;

      if (files.length > maxImages) {
        alert(`画像は最大${maxImages}枚まで選択できます`);
        return;
      }

      const newFileNames = files.map(file => file.name); // 新しく選択された画像のファイル名
      setEditFileNames(prev => [...prev, ...newFileNames]);

      try {
        const batchSize = 1;
        const compressedImages = [];

        // 画像を圧縮してから状態に追加
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(file => compressImage(file)) // 画像圧縮処理
          );
          compressedImages.push(...batchResults);
          setEditImages(prev => [...prev, ...batchResults]);

          // バッチ処理で一度に処理しすぎないように100msの待機を挟む
          if (i + batchSize < files.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('画像の圧縮に失敗しました:', error);
      }
    }
  };

  // 画像を削除する関数
  const removeEditImage = (index) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
    setEditFileNames(prev => prev.filter((_, i) => i !== index));
  };

  // フォームが送信されたときの処理
  const handleEditSubmit = (e) => { // Keep it synchronous
    e.preventDefault();

    let finalGroupId = selectedGroupId;
    if (showNewGroupInputs && newGroupName.trim() !== '') {
      const newGroup = addGroup(newGroupName.trim(), newGroupColor); // addGroup from App.js
      if (newGroup && newGroup.id) {
          finalGroupId = newGroup.id;
      } else {
          console.error("Failed to create new group or newGroup.id is missing from EditTodoModal");
          finalGroupId = todo.groupId || ''; // Revert to original or no group
      }
    }

    // 期限を設定（期限がない場合はnull）
    const dueDateTime = editDueDate && editDueTime
      ? new Date(`${editDueDate}T${editDueTime}`).toISOString()
      : null;

    // 編集後のタスクオブジェクトを作成
    const updatedTodoData = { // Renamed to avoid conflict with prop 'todo'
      ...todo,
      text: editText,
      images: [...editImages],
      dueDateTime: dueDateTime,
      priority: priority,
      groupId: finalGroupId === 'create_new_group' || finalGroupId === '' ? null : finalGroupId,
    };

    // タスクを更新
    updateTodo(updatedTodoData);
    // closeModal(); // Usually modals close themselves after submit, App.js handles editingTodo to null.
  };

  return (
    <div className="edit-modal" onClick={closeModal}>
      {/* モーダルコンテンツ部分。クリックイベントが親に伝播しないようにする */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* モーダルを閉じるボタン */}
        <button className="close-modal-button" onClick={closeModal}>
          ✕
        </button>

        <h2>タスクを編集</h2>

        {/* 編集フォーム */}
        <form onSubmit={handleEditSubmit} className="edit-form">
          {/* タスクテキストの入力欄 */}
          <div className="input-container">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="タスクを編集"
              className="todo-input"
            />

            {/* 画像の選択とカメラでの撮影 */}
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
                onClick={() => setShowCamera(true)} // カメラでの撮影モードを表示
                className="file-input-button"
              >
                カメラで撮影
              </button>

              {/* 追加された画像のファイル情報 */}
              {editFileNames.length > 0 && (
                <div className="file-info-container">
                  {editFileNames.map((fileName, index) => (
                    <div key={index} className="file-info">
                      <span className="file-name">{fileName}</span>
                      <button
                        type="button"
                        onClick={() => removeEditImage(index)} // 画像削除ボタン
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
          
          {/* Group Selection UI */}
          <div className="group-selection-container">
            <label htmlFor="edit-group-select">グループ:</label>
            <select
              id="edit-group-select"
              value={selectedGroupId}
              onChange={(e) => {
                setSelectedGroupId(e.target.value);
              }}
              className="group-select"
            >
              <option value="">グループなし</option>
              {groups && groups.map(group => ( // Added groups && check
                <option key={group.id} value={group.id} style={{ color: group.color }}>
                  {group.name}
                </option>
              ))}
              <option value="create_new_group">新規グループを作成</option>
            </select>

            {showNewGroupInputs && (
              <div className="new-group-inputs">
                <input
                  type="text"
                  placeholder="新規グループ名"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="new-group-name-input"
                />
                <input
                  type="color"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="new-group-color-input"
                />
              </div>
            )}
          </div>

          {/* 期限の設定 */}
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

          {/* 優先度スライダー */}
          <div className="priority-container">
            <label htmlFor="priority-slider">優先度: {getPriorityStr(priority)}</label>
            <input
              id="priority-slider"
              type="range"
              min="0"
              max="5"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="priority-slider"
            />
          </div>

          {/* プレビューとして表示される画像 */}
          {editImages.length > 0 && (
            <div className="image-preview-container">
              {editImages.map((image, index) => (
                <div key={index} className="image-preview">
                  <img
                    src={image}
                    alt={`プレビュー ${index + 1}`}
                    onClick={() => openImageModal(image)} // 画像クリックで拡大表示
                  />
                </div>
              ))}
            </div>
          )}

          {/* 保存ボタン */}
          <button type="submit" className="save-button">保存</button>
        </form>
      </div>
    </div>
  );
}

export default EditTodoModal;
