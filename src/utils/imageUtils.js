/**
 * 画像を圧縮する関数
 * @param {string} base64String - 圧縮する画像のBase64文字列
 * @param {number} maxWidth - 最大幅（ピクセル）
 * @returns {Promise<string>} 圧縮された画像のBase64文字列
 */
export const compressImage = (base64String, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};
