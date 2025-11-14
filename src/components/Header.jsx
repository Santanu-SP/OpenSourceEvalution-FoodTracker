// src/components/Header.jsx
import React from 'react';

export default function Header({ onTabChange, activeTab }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo">🥗</span>
        <h1>NutriVision</h1>
      </div>
      <nav className="nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => onTabChange('home')}>Scan</button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => onTabChange('history')}>History</button>
      </nav>
    </header>
  );
}