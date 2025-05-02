import React, { useRef, useEffect } from 'react';
import useCamera from '../hooks/useCamera';

function CameraModal({ closeModal, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { startCamera, stopCamera, capturePhoto } = useCamera(videoRef, canvasRef, onCapture);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="camera-modal" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal-button" onClick={closeModal}>
          ✕
        </button>
        <h2>カメラで写真を撮影</h2>
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button
            onClick={capturePhoto}
            className="capture-button"
          >
            撮影
          </button>
        </div>
      </div>
    </div>
  );
}

export default CameraModal;
