import React, { useState, useRef, useEffect } from 'react'; // Import useEffect
import { compressImage } from '../utils/imageUtils';
import { getPriorityStr } from '../utils/priorityUtils';
/**
 * TodoForm コンポーネント
 * - 新しいToDoを作成するフォーム。
 * - テキスト、期限、画像を入力できる。
 * - 画像の圧縮やプレビュー機能も提供。
 *
 * @param {Function} addTodo - 新しいToDoをリストに追加する関数
 * @param {Function} setShowCamera - カメラモーダルを表示する関数
 * @param {Function} openImageModal - 画像モーダルを開く関数
 * @param {string | null} capturedImageForNewTodo - 画像キャプチャ機能で取得した画像データ
 * @param {Function} clearCapturedImageForNewTodo - capturedImageForNewTodo をクリアする関数
 * @param {Array} groups - 利用可能なグループのリスト
 * @param {Function} addGroup - 新しいグループを追加する関数
 */
function TodoForm({ addTodo, setShowCamera, openImageModal, capturedImageForNewTodo, clearCapturedImageForNewTodo, groups, addGroup }) {
  const [input, setInput] = useState('');            // タスクのテキスト入力値
  const [images, setImages] = useState([]);           // 添付された画像のリスト
  const [fileNames, setFileNames] = useState([]);     // 画像ファイル名リスト
  const [dueDate, setDueDate] = useState('');         // 期限日（YYYY-MM-DD）
  const [dueTime, setDueTime] = useState('');         // 期限時刻（HH:MM）
  const [priority, setPriority] = useState(0);        // 優先度（0-5）
  const fileInputRef = useRef(null);                  // 画像ファイル入力の参照

  // Group related states
  const [selectedGroupId, setSelectedGroupId] = useState(''); // Stores the ID of the selected group
  const [showNewGroupInputs, setShowNewGroupInputs] = useState(false); // Toggle for new group inputs
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#FFFFFF'); // Default color for new group

  // 画像が選択されたときに呼び出される
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);         // 選択されたファイルを配列に変換
    if (files.length > 0) {
      const isMobile = window.innerWidth <= 768;       // スマホの場合の判定
      const maxImages = isMobile ? 2 : 5;              // スマホでは最大2枚、それ以外は最大5枚

      if (files.length > maxImages) {
        alert(`画像は最大${maxImages}枚まで選択できます`);  // 画像枚数制限
        return;
      }

      const newFileNames = files.map(file => file.name);  // 新しいファイル名を取得
      setFileNames(prev => [...prev, ...newFileNames]);    // ファイル名をリストに追加

      try {
        const batchSize = 1;  // 一度に圧縮する画像の数
        const compressedImages = [];  // 圧縮された画像を格納するリスト
        
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);    // バッチ処理
          const batchResults = await Promise.all(
            batch.map(file => compressImage(file))   // 画像圧縮
          );
          compressedImages.push(...batchResults);   // 圧縮結果を格納
          setImages(prev => [...prev, ...batchResults]);  // 圧縮画像を画像リストに追加
          
          // バッチが残っている場合、100ms待機してから次の処理
          if (i + batchSize < files.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('画像の圧縮に失敗しました:', error);
      }
    }
  };

  // ファイル入力をクリアする関数
  const clearFileInput = () => {
    setImages([]);          // 画像リストをクリア
    setFileNames([]);       // ファイル名リストをクリア
    setDueDate('');         // 期限日をリセット
    setDueTime('');         // 期限時刻をリセット
    setPriority(3);         // 優先度をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // ファイル入力をクリア
    }
    // Reset group states
    setSelectedGroupId('');
    setShowNewGroupInputs(false);
    setNewGroupName('');
    setNewGroupColor('#FFFFFF');
  };

  // useEffect to handle captured image from camera
  useEffect(() => {
    if (capturedImageForNewTodo) {
      // Add the captured image to the 'images' state
      setImages(prevImages => [...prevImages, capturedImageForNewTodo]);
      
      // Add a placeholder filename to the 'fileNames' state
      // You can use a generic name or generate one based on timestamp
      const newFileName = `camera-${Date.now()}.jpg`;
      setFileNames(prevFileNames => [...prevFileNames, newFileName]);
      
      // Clear the captured image state in App.js
      clearCapturedImageForNewTodo();
    }
  }, [capturedImageForNewTodo, clearCapturedImageForNewTodo]);

  // 画像を削除する関数
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));   // 画像を削除
    setFileNames(prev => prev.filter((_, i) => i !== index)); // ファイル名を削除
  };

  // フォームの送信処理
  const handleSubmit = (e) => {
    e.preventDefault();  // フォーム送信のデフォルト動作を防止
    if (input.trim() === '' && images.length === 0) return;  // タスク内容が空で、画像もない場合は何もしない

    let finalGroupId = selectedGroupId;
    if (showNewGroupInputs && newGroupName.trim() !== '') {
      // addGroup is synchronous as implemented in App.js
      const newGroup = addGroup(newGroupName.trim(), newGroupColor);
      if (newGroup && newGroup.id) {
        finalGroupId = newGroup.id;
      } else {
        console.error("Failed to create new group or newGroup.id is missing");
        // Optionally, handle error: don't proceed or use no group
        // For now, it will fall back to selectedGroupId or no group
      }
    }

    // 期限が設定されている場合、日付と時刻を統合してISOフォーマットにする
    const dueDateTime = dueDate && dueTime 
      ? new Date(`${dueDate}T${dueTime}`).toISOString()
      : null;

    // 新しいToDoオブジェクトを作成
    const newTodo = {
      id: Date.now(),                   // 一意なIDとして現在のタイムスタンプを使用
      text: input,                      // 入力されたタスクテキスト
      images: [...images],              // 圧縮された画像リスト
      completed: false,                 // 初期状態では未完了
      dueDateTime: dueDateTime ,        // 設定された期限
      priority: priority,               // 優先度を追加
      groupId: finalGroupId === 'create_new_group' || finalGroupId === '' ? null : finalGroupId, // Store groupId
    };
    
    addTodo(newTodo);  // 新しいToDoをリストに追加
    setInput('');      // 入力フォームをリセット
    clearFileInput();  // 画像、期限、グループ関連の入力をクリア
    // Explicitly reset group fields here as clearFileInput might be called elsewhere
    setSelectedGroupId('');
    setShowNewGroupInputs(false);
    setNewGroupName('');
    setNewGroupColor('#FFFFFF');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="input-container">
        {/* タスク入力フィールド */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力"
          className="todo-input"
        />
        
        <div className="file-input-container">
          <div className="file-input-buttons">
            {/* 画像選択ボタン */}
            <label className="file-input-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}   // 画像選択時に画像を圧縮
                ref={fileInputRef}
                className="image-input"
                multiple
              />
              <span className="file-input-button">画像を選択</span>
            </label>

            {/* カメラ起動ボタン */}
            <label className="file-input-label">
              <button
                type="button"
                onClick={() => setShowCamera(true)}  // カメラモーダルを表示
                className="file-input-button"
              >
                カメラで撮影
              </button>
            </label>
          </div>
        </div>

        {/* 選択された画像のファイル名を表示 */}
        {fileNames.length > 0 && (
          <div className="file-info-container">
            {fileNames.map((fileName, index) => (
              <div key={index} className="file-info">
                <span className="file-name">{fileName}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}  // 画像を削除
                  className="clear-file-button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Selection */}
      <div className="group-selection-container">
        <label htmlFor="group-select">Group:</label>
        <select
          id="group-select"
          value={selectedGroupId}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'create_new_group') {
              setShowNewGroupInputs(true);
              setSelectedGroupId('create_new_group');
            } else {
              setShowNewGroupInputs(false);
              setSelectedGroupId(value);
            }
          }}
          className="group-select"
        >
          <option value="">No Group</option>
          {groups && groups.map(group => (
            <option key={group.id} value={group.id} style={{ color: group.color }}>
              {group.name}
            </option>
          ))}
          <option value="create_new_group">Create new group...</option>
        </select>

        {showNewGroupInputs && (
          <div className="new-group-inputs">
            <input
              type="text"
              placeholder="New group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="new-group-name-input"
            />
            <input
              type="color" // Simple color picker
              value={newGroupColor}
              onChange={(e) => setNewGroupColor(e.target.value)}
              className="new-group-color-input"
            />
          </div>
        )}
      </div>
      
      {/* 期限日と時刻の入力 */}
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
      
      {/* 画像プレビュー */}
      {images.length > 0 && (
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img
                src={image}
                alt={`プレビュー ${index + 1}`}
                onClick={() => openImageModal(image)}  // 画像クリックでモーダル表示
              />
            </div>
          ))}
        </div>
      )}
      
      {/* 追加ボタン */}
      <button type="submit" className="add-button">追加</button>
    </form>
  );
}

export default TodoForm;
