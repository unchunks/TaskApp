/**
 * 背景色に応じて最適な文字色（黒または白）を返す
 * @param {string} backgroundColor - 16進数の色コード（例: '#FF0000'）
 * @returns {string} - 最適な文字色（'#000000' または '#FFFFFF'）
 */
export const getContrastTextColor = (backgroundColor) => {
  // 背景色からRGB値を取得
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);
  
  // 相対輝度を計算（YIQ方式）
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // 輝度が128以上なら黒、それ以下なら白を返す
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

/**
 * 色の透明度を変更する
 * @param {string} color - 16進数の色コード（例: '#FF0000'）
 * @param {number} opacity - 透明度（0-1）
 * @returns {string} - 透明度を変更した色コード
 */
export const setColorOpacity = (color, opacity) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * 色を明るくする
 * @param {string} color - 16進数の色コード（例: '#FF0000'）
 * @param {number} amount - 明るさの増加量（0-255）
 * @returns {string} - 明るくした色コード
 */
export const lightenColor = (color, amount) => {
  const r = Math.min(255, parseInt(color.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(color.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(color.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * 色を暗くする
 * @param {string} color - 16進数の色コード（例: '#FF0000'）
 * @param {number} amount - 明るさの減少量（0-255）
 * @returns {string} - 暗くした色コード
 */
export const darkenColor = (color, amount) => {
  const r = Math.max(0, parseInt(color.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(color.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(color.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}; 