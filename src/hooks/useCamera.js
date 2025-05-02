import { useCallback } from 'react';

function useCamera(videoRef, canvasRef, onCapture) {
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('カメラの起動に失敗しました:', error);
      alert('カメラへのアクセスが許可されていません。');
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  const capturePhoto = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      const blob = await fetch(imageData).then(res => res.blob());
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });

      if (onCapture) {
        onCapture(file);
      }

      stopCamera();
    }
  }, [videoRef, canvasRef, onCapture, stopCamera]);

  return { startCamera, stopCamera, capturePhoto };
}

export default useCamera;
