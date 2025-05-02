import { useState, useEffect } from 'react';

/**
 * useLocalStorage - Reactの状態管理とlocalStorageを同期させるカスタムフック
 *
 * @param {string} key - localStorage に保存する際のキー名
 * @param {*} initialValue - 初期値（localStorage にデータがなければこれを使う）
 * @returns {[any, Function]} - [現在の値, 値を更新する関数]
 */
function useLocalStorage(key, initialValue) {
  // useStateの初期化：localStorageに値があればそれを使用、なければinitialValueを使う
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key); // localStorageから該当キーの値を取得
    return savedValue ? JSON.parse(savedValue) : initialValue; // JSON文字列をオブジェクトに変換して返す
  });

  // 値が変化したときにlocalStorageにも保存する
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)); // オブジェクトをJSON文字列に変換して保存
  }, [key, value]); // keyやvalueが変化するたびに実行

  // 状態とその更新関数を返す（ReactのuseStateと同様のインターフェース）
  return [value, setValue];
}

export default useLocalStorage;
