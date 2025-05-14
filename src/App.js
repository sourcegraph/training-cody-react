import React from 'react';
import './App.css';
import PetList from './components/PetList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Sourcegraph Pet Store</h1>
          <p className="header-subtitle">AI Assisted Pet Store</p>
        </div>
      </header>
      <main className="App-main">
        <div className="content-container">
          <PetList />
        </div>
      </main>
      <footer className="App-footer">
        <p>Powered by Sourcegraph Technology</p>
      </footer>
    </div>
  );
}

export default App;
