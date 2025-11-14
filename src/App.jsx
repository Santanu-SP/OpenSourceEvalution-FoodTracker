// src/App.jsx
import React, { useState } from 'react';
import Home from './pages/home.jsx';
import History from './pages/History.jsx';
import Header from './components/Header.jsx';

export default function App() {
  const [tab, setTab] = useState('home');
  return (
    <div className="app">
      <Header onTabChange={setTab} activeTab={tab} />
      {tab === 'home' ? <Home /> : <History />}
      <footer className="footer">
        <span>Built with OpenFoodFacts • Chart.js • React</span>
      </footer>
    </div>
  );
}