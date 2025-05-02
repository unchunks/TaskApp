import React from 'react';

function ImageModal({ imageUrl, closeModal }) {
  return (
    // モーダル全体を覆うdiv。クリックでモーダルを閉じる
    <div className="image-modal" onClick={closeModal}>
      {/* モーダルのコンテンツ部分。クリックイベントが親のdivに伝播しないようにする */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {/* モーダルを閉じるボタン */}
        <button className="close-modal-button" onClick={closeModal}>
          ✕
        </button>

        {/* 拡大表示された画像 */}
        <img src={imageUrl} alt="拡大表示" className="modal-image" />
      </div>
    </div>
  );
}

export default ImageModal;
