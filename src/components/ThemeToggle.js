// ThemeToggle.js
import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // ローカルストレージからテーマ設定を取得するか、デフォルトでライトモード
  const [darkMode, setDarkMode] = useState(() => {
    // localStorageから'テーマ'を取得。保存されているテーマが'dark'ならダークモードに設定。
    const savedTheme = localStorage.getItem('theme');
    // 'dark'が保存されていたらダークモードに設定、そうでなければライトモード
    return savedTheme === 'dark';
  });

  // テーマを切り替える関数
  const toggleTheme = () => {
    // ダークモードの状態を反転させる
    setDarkMode(!darkMode);
  };

  // テーマが変更されたときにDOMとローカルストレージを更新
  useEffect(() => {
    // darkModeがtrue（ダークモード）なら、bodyに'dark-mode'クラスを追加
    if (darkMode) {
      document.body.classList.add('dark-mode');
      // 'theme'を'localStorage'に保存
      localStorage.setItem('theme', 'dark');
    } else {
      // ダークモードを解除する場合、'dark-mode'クラスをbodyから削除
      document.body.classList.remove('dark-mode');
      // 'theme'を'localStorage'に保存
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]); // darkModeの変更時に実行される

  // ページロード時に初期テーマを適用
  useEffect(() => {
    // ユーザーシステムの設定を確認（オプション）
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // ローカルストレージにテーマが保存されていない場合はシステム設定を使用
    if (!localStorage.getItem('theme')) {
      setDarkMode(prefersDarkMode); // システム設定に従ってダークモードかライトモードかを設定
    }
  }, []); // 初回のマウント時に実行

  return (
    // テーマ切り替えボタン
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}  // ボタンクリック時にテーマを切り替える
      aria-label="テーマ切り替え" // アクセシビリティ用のラベル
    >
      {/* ダークモードの場合は太陽アイコン（☀️）、ライトモードの場合は月アイコン（🌙）を表示 */}
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
