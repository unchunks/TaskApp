/**
 * 日付文字列を「YYYY/MM/DD HH:mm」形式に整形して返す関数
 * 
 * @param {string} dateTimeString - ISO形式などの日時文字列
 * @returns {string} - フォーマット済みの日時文字列（例: "2025/5/2 14:05"）
 */
export const formatDueDateTime = (dateTimeString) => {
  // 入力が空またはnull/undefinedなら空文字を返す（安全対策）
  if (!dateTimeString) return '';

  // 文字列をDateオブジェクトに変換
  const date = new Date(dateTimeString);

  // getMonth() は 0〜11 を返すため、+1 して正しい月にする
  // getMinutes() は1桁のとき "0" を追加して2桁に（例: "9" → "09"）
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};
