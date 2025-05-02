import React, { useRef, useEffect } from 'react';
import useCamera from '../hooks/useCamera'; // useCamera フックをインポート

function CameraModal({ closeModal, onCapture }) {
  // ビデオ要素とキャンバス要素の参照を作成
  const videoRef = useRef(null);  // カメラ映像を表示するためのビデオ要素の参照
  const canvasRef = useRef(null); // 撮影した画像を描画するためのキャンバス要素の参照

  // useCamera フックを呼び出し、カメラの制御機能（startCamera, stopCamera, capturePhoto）を取得
  const { startCamera, stopCamera, capturePhoto } = useCamera(videoRef, canvasRef, onCapture);

  // コンポーネントのマウント時にカメラを起動し、アンマウント時にカメラを停止
  useEffect(() => {
    startCamera(); // カメラを起動
    return () => stopCamera(); // コンポーネントがアンマウントされる際にカメラを停止
  }, [startCamera, stopCamera]); // startCamera と stopCamera が変化した場合に再実行

  return (
    <div className="camera-modal" onClick={closeModal}>
      {/* モーダルの内容がクリックされても親要素へのイベント伝播を防ぐ */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* モーダルを閉じるボタン */}
        <button className="close-modal-button" onClick={closeModal}>
          ✕
        </button>
        
        <h2>カメラで写真を撮影</h2>
        
        {/* カメラの映像を表示するコンテナ */}
        <div className="camera-container">
          {/* ビデオ要素にカメラ映像を表示 */}
          <video
            ref={videoRef} // ビデオ要素の参照を設定
            autoPlay // 自動的に再生
            playsInline // モバイル端末での画面表示時にフルスクリーンにならないようにする
            className="camera-video"
          />
          {/* キャンバス要素は非表示で、撮影時に画像を描画するために使用 */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* 撮影ボタン */}
          <button
            onClick={capturePhoto} // 撮影時に写真をキャプチャする関数
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
