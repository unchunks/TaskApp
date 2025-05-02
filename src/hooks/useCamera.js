import { useCallback, useState, useEffect } from 'react';

function useCamera(videoRef, canvasRef, onCapture) {
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState('');

  // カメラを停止する関数を最初に定義
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  // 指定したデバイスIDでカメラを起動
  const startCamera = useCallback(async (deviceId = currentDeviceId) => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera(); // 既存のカメラストリームを停止
      }

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCurrentDeviceId(deviceId);
      }
    } catch (error) {
      console.error('カメラの起動に失敗しました:', error);
      alert('カメラへのアクセスが許可されていません。');
    }
  }, [videoRef, currentDeviceId, stopCamera]);

  // 利用可能なカメラデバイスを取得する
  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      // デフォルトで最初のカメラを選択
      if (videoDevices.length > 0 && !currentDeviceId) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
      
      return videoDevices;
    } catch (error) {
      console.error('カメラデバイスの取得に失敗しました:', error);
      return [];
    }
  }, [currentDeviceId]);

  // 初回マウント時にカメラデバイスを取得
  useEffect(() => {
    getVideoDevices();
  }, [getVideoDevices]);

  // 写真撮影
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      
      // Blob に変換
      fetch(imageData)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          if (onCapture) {
            onCapture(file);
          }
        });
    }
  }, [videoRef, canvasRef, onCapture]);

  // カメラを切り替え
  const switchCamera = useCallback(async (deviceId) => {
    if (deviceId && deviceId !== currentDeviceId) {
      await startCamera(deviceId);
    }
  }, [currentDeviceId, startCamera]);

  // 次のカメラに切り替え
  const switchToNextCamera = useCallback(async () => {
    if (devices.length <= 1) return; // カメラが1つ以下なら何もしない
    
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    await switchCamera(devices[nextIndex].deviceId);
  }, [devices, currentDeviceId, switchCamera]);

  return { 
    startCamera, 
    stopCamera, 
    capturePhoto, 
    switchCamera, 
    switchToNextCamera, 
    devices,
    currentDeviceId
  };
}

export default useCamera;