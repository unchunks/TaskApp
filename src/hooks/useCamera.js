import { useCallback, useState, useEffect } from 'react';

/**
 * useCamera - カメラ操作を行うカスタムフック
 *
 * @param {RefObject} videoRef - カメラ映像を表示する video 要素の参照
 * @param {RefObject} canvasRef - 撮影画像を取得する canvas 要素の参照
 * @param {Function} onCapture - 撮影後に呼ばれるコールバック（File を引数に取る）
 */
function useCamera(videoRef, canvasRef, onCapture) {
  // 利用可能なカメラデバイス一覧
  const [devices, setDevices] = useState([]);
  // 現在使用中のデバイスID
  const [currentDeviceId, setCurrentDeviceId] = useState('');

  /**
   * カメラ映像の停止処理
   */
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks(); // すべてのトラック（映像/音声）を取得
      tracks.forEach(track => track.stop()); // 個別に停止
      videoRef.current.srcObject = null; // 映像ストリームを解除
    }
  }, [videoRef]);

  /**
   * カメラの起動（指定デバイス）
   * @param {string} deviceId - 使用するカメラの deviceId（未指定なら現在のdeviceId）
   */
  const startCamera = useCallback(async (deviceId = currentDeviceId) => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera(); // 前のカメラがあれば停止
      }

      // カメラのメディア取得条件を設定（デバイスIDを指定）
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      
      // カメラの映像を取得
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // 取得した映像を video に表示
        setCurrentDeviceId(deviceId); // 使用中の deviceId を保存
      }
    } catch (error) {
      console.error('カメラの起動に失敗しました:', error);
      alert('カメラへのアクセスが許可されていません。');
    }
  }, [videoRef, currentDeviceId, stopCamera]);

  /**
   * 利用可能なカメラデバイスを取得
   */
  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices(); // 全デバイス取得
      const videoDevices = devices.filter(device => device.kind === 'videoinput'); // カメラのみ抽出
      setDevices(videoDevices); // ステートに保存

      // デフォルトで最初のカメラを選択（まだ選ばれていなければ）
      if (videoDevices.length > 0 && !currentDeviceId) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }

      return videoDevices;
    } catch (error) {
      console.error('カメラデバイスの取得に失敗しました:', error);
      return [];
    }
  }, [currentDeviceId]);

  /**
   * 初回マウント時にカメラデバイス一覧を取得
   */
  useEffect(() => {
    getVideoDevices();
  }, [getVideoDevices]);

  /**
   * 撮影処理（canvasを使って画像をキャプチャ）
   */
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // canvas のサイズを video に合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // video の現在のフレームを描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // base64 データURLで画像を取得
      const imageData = canvas.toDataURL('image/jpeg');

      // base64 を Blob に変換して File にラップ
      fetch(imageData)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          if (onCapture) {
            onCapture(file); // 親に渡す
          }
        });
    }
  }, [videoRef, canvasRef, onCapture]);

  /**
   * 任意の deviceId に切り替え
   * @param {string} deviceId - 切り替え先のデバイスID
   */
  const switchCamera = useCallback(async (deviceId) => {
    if (deviceId && deviceId !== currentDeviceId) {
      await startCamera(deviceId);
    }
  }, [currentDeviceId, startCamera]);

  /**
   * 複数カメラのうち、次のカメラに切り替える
   */
  const switchToNextCamera = useCallback(async () => {
    if (devices.length <= 1) return; // カメラが1台以下の場合は切り替え不要

    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    await switchCamera(devices[nextIndex].deviceId);
  }, [devices, currentDeviceId, switchCamera]);

  // フックとして外部に提供する操作群
  return { 
    startCamera,             // カメラ起動
    stopCamera,              // カメラ停止
    capturePhoto,            // 撮影
    switchCamera,            // 任意のカメラに切り替え
    switchToNextCamera,      // 次のカメラに切り替え
    devices,                 // 利用可能なカメラデバイス一覧
    currentDeviceId          // 現在使用中のカメラID
  };
}

export default useCamera;
