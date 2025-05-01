import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>カウンターアプリ</h1>
        <p>現在のカウント: {count}</p>
        <div className="button-container">
          <button onClick={() => setCount(count + 1)}>増やす</button>
          <button onClick={() => setCount(count - 1)}>減らす</button>
          <button onClick={() => setCount(0)}>リセット</button>
        </div>
      </header>
    </div>
  );
}

export default App;
