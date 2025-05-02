// ThemeToggle.js
import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // ローカルストレージからテーマ設定を取得するか、デフォルトでライトモード
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // テーマを切り替える関数
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // テーマが変更されたときにDOMとローカルストレージを更新
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // ページロード時に初期テーマを適用
  useEffect(() => {
    // ユーザーシステムの設定を確認（オプション）
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // ローカルストレージにテーマが保存されていない場合はシステム設定を使用
    if (!localStorage.getItem('theme')) {
      setDarkMode(prefersDarkMode);
    }
  }, []);

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="テーマ切り替え">
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;