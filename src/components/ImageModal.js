import React from 'react';

function ImageModal({ imageUrl, closeModal }) {
  return (
    <div className="image-modal" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal-button" onClick={closeModal}>
          ✕
        </button>
        <img src={imageUrl} alt="拡大表示" className="modal-image" />
      </div>
    </div>
  );
}

export default ImageModal;
