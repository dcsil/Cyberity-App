import React from 'react';
import logo from './assets/logo_cyberity_text.png'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img data-testid="test-logo" src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
